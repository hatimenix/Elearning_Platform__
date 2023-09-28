import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/auth/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/auth/Signup";
import { Profile } from "./components/profile/Profile";
import { Plainte } from "./components/profile/Plainte";
import Formation_ from "./views/formations/Formation_";

import Modules from "./views/modules/Modules";
import ContenuModule from "./views/modules/content/ContenuModule";
import { Submodcontent } from "./views/modules/content/sub-content/SContenuModule";

import SContenuModuleDocs from "./views/modules/content/sub-content/SContenuModuleDocs";
import Index from "./views/Index";

import MyComponent from "./views/modules/content/sub-content/test"

import ListeCertificat from "./views/certificat/ListeCertificat"
import Certificat from "./views/certificat/Certificat"
import About from "./views/About";
import Tutorial from "./views/Tutorial";

import RequireAuth from "./components/hooks/RequireAuth";
import Chapitre from "./views/modules/chapter/Chapitre";
import Suivi_Plainte from "./components/profile/Suivi_Plainte";
import Accueil from "./views/Accueil";
import Modules_ from "./views/modules/Modules__";
import ResetPassword from "./views/auth/ResetPassword";
import SContenuPpt from "./views/modules/content/sub-content/SContenuPpt";
import TabbedContent from "./views/modules/content/sub-content/TabbedContent";
import Contact from "./views/Contact";
import ResetPwdPage from "./views/auth/ResetPwdPage";




const router = createBrowserRouter([
  {
    path: '',
    element: <DefaultLayout />,
    children: [
      ,
      {
        path: "ppt",
        element: <RequireAuth element={<SContenuPpt />} />
      },
      {
        path: '/',
        element: <RequireAuth element={<Accueil />} />
      },

      {
        path: '/Formation_',
        element: <RequireAuth element={<Formation_ />} />
      },
      {

        path: '/tutoriel',
        element: <RequireAuth element={<Tutorial />} />
      },
      {

        path: '/contact',
        element: <RequireAuth element={<Contact />} />
      },
      {
        path: '/MonApprentissage',
        element: <RequireAuth element={<Modules_ />} />
      },

      {
        path: '/Suggestion',
        element: <RequireAuth element={<Plainte />} />
      }, {
        path: '/profile',
        element: <RequireAuth element={<Profile />} />
      },
      {
        path: '/tickets',
        element: <RequireAuth element={<Suivi_Plainte />} />
      },
      // , {
      //   path: '/aPropos',
      //   element: <RequireAuth element={<About />} />
      // },
      {
        path: '/Accueil',
        element: <RequireAuth element={<Accueil />} />
      },
      {
        path: '/modules',
        element: <RequireAuth element={<Modules />} />
      },
      {
        path: '/chapitres',
        element: <RequireAuth element={<Chapitre />} />
      },
      {
        path: '/modcontent',
        element: <RequireAuth element={<ContenuModule />} />
      },
      {
        path: '/submodcontent',
        element: <RequireAuth element={<Submodcontent />} />
      },
      {
        path: '/submodcontentdoc',
        element: <RequireAuth element={<SContenuModuleDocs goBack={false} showButton={true} />} />
      },
      {
        path: '/tabbed',
        element: <RequireAuth element={<TabbedContent />} />
      },
      ,
      {
        path: '/test/:id',
        element: <RequireAuth element={<MyComponent />} />
      },


      {
        path: "listeCertificat",
        element: <RequireAuth element={<ListeCertificat />} />
      },
      {
        path: "certificat",
        element: <RequireAuth element={<Certificat />} />
      },


    ]
  },

  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: '/index',
        element: <Index />
      },
      {
        path: '/login',
        element: <Login />
      },

      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/reset_password',
        element: <ResetPassword />
      },
      {
        path: '/reinitialisation_de_motdepasse/:userId/:token/:expires',
        element: <ResetPwdPage />
      },
      {
        path: "test/:id",
        element: <MyComponent />
      },




    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
])

export default router;
