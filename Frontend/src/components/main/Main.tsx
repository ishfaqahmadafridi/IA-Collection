import Carousel from '../carousal/Carousel';
import BoysGirlsCategory from '../BoysGirlsCategory/BoysGirlsCategory';
import FragranceCosmetics from '../fragranceCostmetics/FragranceCosmetics';
import WomenCategory from '../womenCategory/WomenCategory';
import WomenFootwear from '../womenfoot/WomenFootwear';
import ManFootwear from '../manFooterwear/ManFootwear';
import MenCategory from '../menCategoey/MenCategory';
import CategorySection from '../actegorysection/CategorySection';
import ScrollReveal from '../layout/ScrollReveal';
import { usePageActivity } from '../../hooks/usePageActivity';

export default function Main() {
    usePageActivity('view_home');

    return (
        <>
            <Carousel />
            <ScrollReveal animation="fade-up">
                <CategorySection />
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={100}>
                <WomenCategory />
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={200}>
                <WomenFootwear />
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={100}>
                <MenCategory />
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={200}>
                <ManFootwear />
            </ScrollReveal>
            <ScrollReveal animation="fade-up">
                <BoysGirlsCategory />
            </ScrollReveal>
            <ScrollReveal animation="fade-scale" delay={300}>
                <FragranceCosmetics />
            </ScrollReveal>
        </>
    );
}
