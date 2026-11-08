import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/auth/authStore';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import LoadingScreen from './components/layout/LoadingScreen';

// Lazy load components for performance (Best Practice)
const Main = lazy(() => import('./components/main/Main'));
const LandingPage = lazy(() => import('./components/landingPage/LandingPage'));
const Catman = lazy(() => import('./components/catman/Catman'));
const Catwomen = lazy(() => import('./components/catwoman/Catwomen'));
const ProductPage = lazy(() => import('./components/productpage/ProductPage'));
const CatBoysG = lazy(() => import('./components/catboyG/CatBoysG'));
const Cart = lazy(() => import('./components/cart/Cart'));
const CatFragrance = lazy(() => import('./components/catfrageance/CatFragrance'));
const CatMakeup = lazy(() => import('./components/catmakeup/CatMakeup'));
const CatSkincare = lazy(() => import('./components/catskincare/CatSkincare'));
const ManFootwear = lazy(() => import('./components/manFooterwear/ManFootwear'));
const WomenCategory = lazy(() => import('./components/womenCategory/WomenCategory'));
const WomenFootwear = lazy(() => import('./components/womenfoot/WomenFootwear'));
const Search = lazy(() => import('./components/search/Search'));
const Tracking = lazy(() => import('./components/tracking/Tracking'));
const Signin = lazy(() => import('./components/sigin/Signin'));
const Register = lazy(() => import('./components/register/Register'));
const Sale = lazy(() => import('./components/sale/Sale'));
const AdminPanel = lazy(() => import('./components/admin/adminPanel'));
const UserProfile = lazy(() => import('./components/profile/UserProfile'));

function App() {
    const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);

    // Load user profile on app init if token exists
    useEffect(() => {
        fetchUserProfile().catch(console.error);
    }, [fetchUserProfile]);

    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<LoadingScreen />}>
                <Routes>
                    {/* Admin route without Layout */}
                    <Route path="/admin" element={<AdminPanel />} />

                    {/* Routes with Layout (Header/Footer) */}
                    <Route element={<Layout />}>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/home" element={<Main />} />
                        <Route path="/men" element={<Catman />} />
                        <Route path="/women" element={<Catwomen />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                        <Route path="/kids" element={<CatBoysG />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/fragrances" element={<CatFragrance />} />
                        <Route path="/makeup" element={<CatMakeup />} />
                        <Route path="/skincare" element={<CatSkincare />} />
                        <Route path="/men-footwear" element={<ManFootwear />} />
                        <Route path="/women-category" element={<WomenCategory />} />
                        <Route path="/women-footwear" element={<WomenFootwear />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/tracking" element={<Tracking />} />
                        <Route path="/signin" element={<Signin />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/sale" element={<Sale />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="*" element={<Main />} /> {/* Fallback route for undefined paths */}
                    </Route>
                </Routes>
            </Suspense>
        </>
    );
}

export default App;
