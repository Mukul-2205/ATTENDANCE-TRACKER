import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {

    return (
        <div className="bg-white dark:bg-gray-900 h-screen flex items-center justify-center overflow-hidden">
            <div className="w-full text-center px-4">
                <span className="font-medium inline-flex justify-center items-center mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 px-5 py-3">
                    Keep a track of maintaining 75% attendance!!😎
                </span>
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                    Welcome to the Attendance Tracker
                </h1>
                <p className="mb-8 text-lg font-normal text-gray-600 lg:text-xl dark:text-gray-400">
                    Streamline your college attendance with our intuitive dashboard and never worry about missing classes again!!🥳
                </p>
                <div className="flex flex-col justify-center items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                    >
                        Get Started
                        <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Landing;
