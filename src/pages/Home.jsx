import React from 'react';
import IDCardPresentation from '../components/IDCardPresentation';
import ExperienceTimeline from '../components/ExperienceTimeline';
import KnowledgeHub from '../components/KnowledgeHub';

const Home = ({ data, weather }) => {
  const { profile, experience, education, skills, courses } = data;

  return (
    <>
      {/* Hero Section */}
      <section id="inicio" className="hero-section" style={{ paddingTop: '8rem', display: 'flex', justifyContent: 'center' }}>
        <IDCardPresentation 
          profile={profile} 
          weather={weather} 
          imageUrl="https://res.cloudinary.com/mzraxq6o/image/upload/v1784055917/yo_fondo_transparente_ktddot.svg" 
        />
      </section>

      {/* Experience Section */}
      <ExperienceTimeline experience={experience} />

      {/* Knowledge & Education Section */}
      <KnowledgeHub education={education} skills={skills} courses={courses} />
    </>
  );
};

export default Home;
