# Intro
The aim of this project is to develop a user-friendly banking system that complies with human-computer interaction principles. 
The system consists of a website and a mobile application that is designed for a seamless and convenient family banking experience for users.
Both are developed separately but read & write data from the same database. 
Manual documentation is provided to assist users in making informed decisions while minimizing errors.


# Note
The competition version of this project used AWS SNS to send SMSs of randomly generated passwords to users signing up. This version does not hae this feature and by default every user has the same password of `123`.
Nextjs project with tailwindcss and prisma. Uses Capacitor for native deployment.

# Development
## Getting Started

After cloning this branch, perform run `npm install`.
Then, create a file called `capacitor.config.ts` in the root directory in your app and copy the code below.

Note: Type `ipconfig` to get your device ipv4 and change the url property under server.

```JavaScript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.example.app',
	appName: 'backend',
	webDir: 'out',
	bundledWebRuntime: false,
	server: {
		url: 'http://xxx.xxx.xxx.xxx:3000', //THIS SHOULD BE UR IPv4, type ipconfig
		cleartext: true,
	},
};

export default config;
```

Run `npm run mobile` (Make sure that `npm run dev` is not running, otherwise it will not work)

Run `npx prisma generate`, then run `npx cap sync`.

Finally, run `npx cap open android` or `npx cap open ios` to launch and test the app on a simulated or physcial native device using Xcode or Android Studio.

IMPORTANT NOTE: for api calls to work on the native apps, the api endpoint should start with the URL you set earlier (with ipconfig) in the `capacitor.config.ts`. For example, if the original api endpoint is "api/getUsers", then in the native apps the endpoint would be "http://xxx.xxx.xxx.xxx:3000/api/getUsers"

## Android Studio Prerequites

Get the **Android SDK Platform 32**.

Open Android Studio. CLick Tools, then SDK manager. On the left panel, under **System Settings** click **Andoid SDK**. Under **Android 12L (Sv2)**, check the **Android SDK 32** that has **API Level 32**. Click Apply.

For a virutal device, I recommend the Pixel 6 API 32.

Possibly, another necessary software might be the Java JDK, get version **17.0.2**.
Make sure to add the path in your computer's environment variables under the exact name **JAVA_HOME**. For example,

| Variable  | Value                            |
| --------- | -------------------------------- |
| JAVA_HOME | C:\Program Files\Java\jdk-17.0.2 |

Finally, there is one line of code that needs to be adjusted in order for the NFC plugin to work within Android Studio.

The path of file is:
`android/capacitor-cordova-android-plugins/src/main/java/com.chariotsolutions.nfc.plugin/NFCPlugin`

Go to line #486 and copy paste the following:
`pendingIntent = PendingIntent.getActivity(activity, 0, intent, PendingIntent.FLAG_IMMUTABLE);`

Whenever you do `npx cap sync`, you need to change the same line every time (for now at least, maybe there will be a solution later)

## Final Notes

Make sure you are always running the webapp, `npm run dev` when wanting to run the native app.

For any questions, or problems make an issue in this repo.
