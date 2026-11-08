import React from 'react';
import type { HomeContentProps } from '../../types/components/home/homeInterface';
import Main from '../main/Main';
import Catman from '../catman/Catman';
import Catwomen from '../catwoman/Catwomen';
import ProductPage from '../productpage/ProductPage';
import CatBoysG from '../catboyG/CatBoysG';
import Cart from '../cart/Cart';
import LandingPage from '../landingPage/LandingPage';
import CatFragrance from '../catfrageance/CatFragrance';
import CatMakeup from '../catmakeup/CatMakeup';
import CatSkincare from '../catskincare/CatSkincare';
import ManFootwear from '../manFooterwear/ManFootwear';
import WomenCategory from '../womenCategory/WomenCategory';
import WomenFootwear from '../womenfoot/WomenFootwear';
import Search from '../search/Search';
import Tracking from '../tracking/Tracking';
import Signin from '../sigin/Signin';
import Register from '../register/Register';
import Sale from '../sale/Sale';
import AdminPanel from '../admin/adminPanel';
import UserProfile from '../profile/UserProfile';

export default function HomeContent({ page }: HomeContentProps) {

    const pageMap: Record<string, React.ReactNode> = {
        landing: <LandingPage />,
        home: <Main />,
        man: <Catman />,
        women: <Catwomen />,
        product: <ProductPage />,
        boysG: <CatBoysG />,
        cart: <Cart />,
        fragrances: <CatFragrance />,
        makeup: <CatMakeup />,
        skincare: <CatSkincare />,
        manFootwear: <ManFootwear />,
        womenCategory: <WomenCategory />,
        womenFootwear: <WomenFootwear />,
        search: <Search />,
        tracking: <Tracking />,
        signin: <Signin />,
        register: <Register />,
        sale: <Sale />,
        admin: <AdminPanel />,
        profile: <UserProfile />,
    };

    return (pageMap[page] || <Main />) as React.ReactElement;
}
