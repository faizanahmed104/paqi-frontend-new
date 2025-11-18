'use client';

import React from 'react';
import Who from './Who';
import MissionVision from './MissionVision';
import Counter from '../home/counter';
import Footer from '../common/footer';
import Hero from '../common/hero';

function AboutUs() {
  const team = [
    {
      name: "Abid Omar",
      role: "Founder",
      img: "assets/team/user.png"
    },
    {
      name: "Dawar Hameed",
      role: "Co-Director",
      img: "assets/team/user.png"
    },
    {
      name: "Mahad Naveed",
      role: "Data Scientist II",
      img: "assets/team/user.png"
    },
    {
      name: "Mariam Shah",
      role: "Communications Lead",
      img: "assets/team/user.png"
    },
    {
      name: "Rehan Ahmad",
      role: "Data Scientist I",
      img: "assets/team/user.png"
    },
  ];
  return (
    <>
      <Hero
        title="About Us"
        subTitle="Learn more about our mission and values."
      />
      <Who />
      <MissionVision />
      <Counter />
      <div>
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Team
            </h2>

            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-28 h-28 rounded-full object-cover border"
                  />

                  <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default AboutUs;
