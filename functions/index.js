const functions = require('firebase-functions');
const admin = require('firebase-admin');
const _ = require('lodash');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

const auth = admin.auth();

exports.deleteUser = functions
    .firestore
    .document('users/{uid}')
    .onDelete((event, context) => {
        const uid = context.params.uid;
        return auth.deleteUser(uid)
            .then(function() {
                return { success: true };
            });
    });

exports.deleteTrack = functions
    .firestore
    .document('tracks/{tid}')
    .onDelete((snap, context) => {
        const tid = context.params.tid;
        const track = snap.data();
        const userRef = db.collection('users').doc(track.author)

        return userRef.get().then(doc => {
            userRef.update({
                tracks: _.filter(doc.data().tracks, id => id !== tid)
            });
        });
    });

exports.addTrack = functions
    .firestore
    .document('tracks/{tid}')
    .onCreate((snap, context) => {
        const tid = context.params.tid;
        const track = snap.data();
        const userRef = db.collection('users').doc(track.author)

        return userRef.get().then(doc => {
            userRef.update({
                tracks: _.concat(doc.data().tracks, tid)
            });
        });
    });
