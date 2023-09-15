import { Capacitor } from '@capacitor/core'
export const IP_ADDRESS = '10.10.186.184:3000'
export const WEB_URL = Capacitor.isNativePlatform() || process.env.NODE_ENV !== "development" ? "https://hci-banking.vercel.app" : "http://localhost:3000"