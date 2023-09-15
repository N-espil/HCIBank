import Head from 'next/head';
import { setupIonicReact, } from '@ionic/react'
import { SessionProvider } from 'next-auth/react'
import NoSSRWrapper from '../components/NoSSRWrapper';
import 'tailwindcss/tailwind.css';
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css'; // Remove if nothing is visible
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '../styles/globals.css';
import '../styles/variables.css';

import { NextUIProvider, createTheme } from '@nextui-org/react'
import context from '../lib/context'
import { useState } from 'react';

setupIonicReact()


function MyApp({ Component, pageProps, session }) {
  const theme = createTheme({
    type: "light", // it could be "light" or "dark"
    theme: {
      colors: {
        
        primaryLight: '#FAE1D0',
        primaryLightHover: '#FAE1D0',
        primaryLightActive: '#FAE1D0',
        primaryLightContrast: '#FAE1D0',
        primary: '#FAE1D0',
        primaryBorder: '#FAE1D0',
        primaryBorderHover: '#FAE1D0',
        primarySolidHover: '#FAE1D0',
        primarySolidContrast: '#FAE1D0',
        primaryShadow: '#FAE1D0',

        secondary: "#EFF6BD",//green

        "accent": "#ADC172",// dark green

        "neutral": "#242529",// black

        "gray": "#6A747C",

        "info": "#9A82BF", //purple

        "success": "#36D399",

        "warning": "#ffc409",

        "error": "#eb445a",

        success: "#D7D7D7",



      },
      breakpoints: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1120px',
        '2xl': '1280px',
        '3xl': '1366px',
        '4xl': '1436px',
        '5xl': '1580px',
      }
    }
  })
  const [graphLoading, setGraphLoading] = useState(true);
  return (
    <>
      <Head>
        <title>HCI Bank</title>
        <meta name="description" content="HCI Banking. For all your banking needs." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/images/logo.svg" />
      </Head>
      <SessionProvider session={session}>
        <NoSSRWrapper>
          <context.Provider value={{graphLoading, setGraphLoading}}>
            <NextUIProvider theme={theme}>
              {/* <IonNav root={() => <Signin />}> */}
              <Component {...pageProps} />
              {/* </IonNav> */}
            </NextUIProvider>
          </context.Provider>
        </NoSSRWrapper>
      </SessionProvider>
    </>
  )
}

export default MyApp
