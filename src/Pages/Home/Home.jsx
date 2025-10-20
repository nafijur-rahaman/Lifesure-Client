import React from 'react';
import Hero from '../../Components/Hero/Hero';
import UserReview from '../../Components/UserReview/UserReview';
import LatestBlog from '../../Components/LatestBlog/LatestBlog';
import NewsletterSection from '../../Components/Newsletter/Newsletter';
import OurAgents from '../../Components/OurAgents/OurAgents';
import OurServices from '../../Components/OurService/OurServices';
import PolicyCard from '../../Components/PolicyCard/PoliceyCard';
import ClaimsPromise from '../../Components/ClaimsPromise/ClaimsPromise';
import TransparencyHub from '../../Components/TransparencyHub/TransparencyHub';

const Home = () => {
    return (
        <div>
            <div className='py-18'>
                <Hero></Hero>
                <OurServices></OurServices>
                <PolicyCard></PolicyCard>
                {/* <UserReview></UserReview> */}
                <LatestBlog></LatestBlog>
                <TransparencyHub></TransparencyHub>
                <NewsletterSection></NewsletterSection>
                <ClaimsPromise></ClaimsPromise>
                <OurAgents></OurAgents>
            </div>
        </div>
    );
};

export default Home;