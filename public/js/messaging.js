import { db, messaging } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { getToken, onMessage } from "firebase/messaging";

const VAPID_KEY =
  "BOItgVxrRZ4KFCIhbj58S-pPkykdPqnTO7LkpDkAB4bcKXZ6FGF3kfMH_KpaP4o24vNYSdAePzP8AuJL88ZR-oI";
const FCM_TOKEN_COLLECTION = "fcmTokens";

export function requestNotificationsPermissions() {
  console.log("Requesting notifications permissions...");
  const permission = Notification.requestPermission();

  if (permission === "granted") {
    saveMessagingDeviceToken(uid);
  } else {
    console.log("Unable to get permission to notify");
  }
}

export async function saveMessagingDeviceToken(uid) {
  const fcmToken = getToken(messging, { vapidKey: VAPID_KEY });

  if (fcmToken) {
    console.log("Got FCM device token: ", fcmToken);
    //save device token to firestore
    const tokenRef = doc(db, FCM_TOKEN_COLLECTION, uid);
    await setDoc(tokenRef, { fcmToken }); //overwrites document if it exists
  } else {
    // need to request permission
    requestNotificationsPermissions(uid);
  }
}
