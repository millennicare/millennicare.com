import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

// import images
import ChildcareIcon from '@/assets/childcare-icon.png';
import DashboardScreen from '@/assets/dashboard_screen.png';
import Derick from '@/assets/dpineda.png';
import ForYouIcon from '@/assets/for-you-icon.png';
import Lakeisha from '@/assets/lhenry.png';
import MillennicareLogo from '@/assets/millennicare_logo.png';
import Richard from '@/assets/radams.png';
import SafeIcon from '@/assets/safe-icon.png';
import Steven from '@/assets/sarce.png';
import WelcomeScreen from '@/assets/welcome_screen_portrait.png';
import MillennicareLogoText from '@/assets/millennicare_logo_with_text.svg';

const navLinks = [
  {
    title: 'About',
    href: '#about',
  },
  {
    title: 'Our Commitment',
    href: '#commitment',
  },
  {
    title: 'Meet Our Team',
    href: '#team',
  },
];

export default function Home() {
  const [hamburgerClicked, setHamburgerClicked] = useState(true);

  const navigate = useNavigate();

  const handleHamburgerClick = (bool: boolean) => setHamburgerClicked(bool);

  const navItems = navLinks.map(({ href, title }) => {
    return (
      <div key={href}>
        <HashLink
          smooth
          to={`${href}`}
          onClick={() => handleHamburgerClick(true)}
        >
          <Button variant='link'>{title}</Button>
        </HashLink>
      </div>
    );
  });

  const HamburgerMenu = () => {
    return (
      <div className='flex flex-col fixed h-1/2 w-full bg-cream border-b border-slate-200 py-4 items-center'>
        <div className='flex flex-row justify-between justify-self-start w-full h-auto px-5 pb-4 bg-cream rounded drop-shadow-lg'>
          <img
            src={MillennicareLogo}
            alt='millenniCare logo'
            className='sm:hidden w-14 h-auto self-center'
          />
          <img
            src={MillennicareLogoText}
            alt='millenniCare logo'
            className='hidden sm:flex object-cover w-[287px]  h-auto'
          />
          <Link
            to=''
            onClick={() => handleHamburgerClick(true)}
            className='self-center'
          >
            <Cross1Icon
              className={`${
                hamburgerClicked ? 'visible' : ''
              } h-8 w-8 fill-gray-500`}
            />
          </Link>
        </div>
        <div className='flex flex-col justify-self-center justify-center h-3/4'>
          {navItems}{' '}
          <Button variant='tertiary' onClick={() => navigate('login')}>
            Login
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-1'>
      <div id='container' className='flex flex-col'>
        {/* Hamburger Menu Page */}
        <div
          className={`
      ${
        hamburgerClicked
          ? 'transition-opacity opacity-0 invisible'
          : 'transition-opacity opacity-100 visible'
      } ease-in-out duration-700`}
        >
          <HamburgerMenu />
        </div>

        {/** Header */}
        <div
          id='header'
          className={`${
            hamburgerClicked ? '' : 'invisible'
          } flex items-center xl:w-full md:min-w-[760px] px-5 lg:px-20 py-4 justify-between bg-cream sticky top-0 z-50`}
        >
          <div className='flex w-fit '>
            <img
              src={MillennicareLogo}
              alt='millenniCare Solo Logo'
              className='sm:hidden object-cover w-14 sm:full h-3/4'
            />
            <img
              src={MillennicareLogoText}
              alt='millenniCare logo'
              className='hidden sm:flex object-cover w-3/4 sm:w-full h-auto'
            />
          </div>
          {/* When window size is < 850 we want to change the div to display hamburger menu instead */}
          <div className='min-[888px]:hidden h-fit w-fit'>
            <Link to='' onClick={() => handleHamburgerClick(false)}>
              <HamburgerMenuIcon
                className={`${
                  hamburgerClicked ? '' : 'invisible'
                } h-8 w-8 fill-gray-500`}
              />
            </Link>
          </div>

          <div className='hidden min-[888px]:flex justify-between h-auto md:h-fit'>
            {navItems}

            <Button variant='tertiary' onClick={() => navigate('login')}>
              Login
            </Button>
          </div>
        </div>
        {/** Hero */}
        <div
          id='hero'
          className='flex items-center justify-center px-5 lg:px-20 bg-cream h-fit lg:h-[88vh]'
        >
          <div className='flex flex-col lg:flex-row gap-20 lg:gap-32 text-center lg:text-left h-full'>
            <div className='self-center w-full md:max-w-lg space-y-3 px-5'>
              <h1 className='text-4xl md:text-5xl lg:text-6xl md:max-w-lg py-5'>
                Modernizing Affordable Childcare for the New Millenium
              </h1>
              <h2 className='text-2xl md:text-3xl text-trustblue pb-2'>
                COMING SOON
              </h2>
              <h3 className='text-lg md:text-2xl text-communityteal pb-2'>
                Low-monthly fee to access quality and affordable childcare
                services.
              </h3>

              <Button variant='default'>Join the Waitlist</Button>
            </div>
            <div className='max-w-xs min-w-[20rem] max-h-2xl pt-3 self-center h-auto px-5'>
              <img src={WelcomeScreen} alt='Welcome screen portrait' />
            </div>
          </div>
        </div>
        {/** About */}
        <div
          id='about'
          className='bg-cream flex items-center flex-row px-20 pt-10 md:pb-5 lg:pb-0 justify-center'
        >
          <div className='flex flex-col-reverse lg:flex-row text-center lg:text-right gap-20 lg:gap-32'>
            <div className='max-w-xs min-w-[20rem] max-h-2xl justify-between px-5 pt-3 self-center h-auto'>
              <img src={DashboardScreen} alt='Welcome screen portrait' />
            </div>
            <div className=' w-full md:max-w-lg px-5 md:px-0 space-y-3 text-center lg:text-left'>
              <h1 className='flex text-primary justify-center'>About Us</h1>
              <h2 className='flex justify-center'>MILLENNICARE</h2>
              <p className='text-lg text-center'>
                Founded in 2020, MillenniCare was born on the understanding that
                quality childcare is a fundamental human need and that not all
                families will have the luxury to afford or access this resource.
              </p>
              <p className='text-lg text-center'>
                Sound like a you-problem? Well, worry no more! With our unique
                prime package and simple-to-use Mobile App, MillenniCare offers
                a solution to both of these problems by enabling families to
                connect with quality caregivers at an affordable and convenient
                rate. Sign up now to become a part of the first 100 founding
                families to be eligible for subsidy!
              </p>
            </div>
          </div>
        </div>
        {/** Commitment */}
        <div
          id='commitment'
          className='bg-palecream flex flex-col lg:px-36 py-12 h-full lg:h-[65vh] justify-center'
        >
          <div className=''>
            <h1 className='text-primary text-center md:m-8 justify-center'>
              Our Commitment
            </h1>
          </div>

          <div className='flex flex-col sm:flex-row justify-center items-center md:justify-evenly'>
            <div className='flex flex-col w-full md:w-1/3 justify-center items-center space-y-4'>
              <img src={SafeIcon} alt='safe icon' className='h-20 w-20' />
              <h3>SAFE</h3>
              <p className='text-base text-center px-5'>
                Book a childcare session with an ease of mind. Our team makes
                sure that all of our caregivers are background checked, and we
                comply to DC licensing and compliance guidelines.
              </p>
            </div>
            <div className='flex flex-col w-full md:w-1/3 justify-center items-center space-y-4 mx-8'>
              <img
                src={ChildcareIcon}
                alt='childcare icon'
                className='h-20 w-20'
              />
              <h3 className='text-center'>AFFORDABLE CHILDCARE</h3>
              <p className='text-base text-center px-5'>
                Pay a low-monthly fee to access quality and affordable childcare
                service. We are aligned with the state and federal government
                initatives to reduce childcare cost from $1600 per month to only
                $500 per month.
              </p>
            </div>
            <div className='flex flex-col w-full md:w-1/3 justify-center items-center space-y-4'>
              <img src={ForYouIcon} alt='for you icon' className='h-20 w-20' />
              <h3>FOR YOU</h3>
              <p className='text-base text-center px-5'>
                Designed for working women, families of all kinds, as well as
                companies offering fringe benefits to increase retention and
                employee morale. MillenniCare addresses the flaws in our current
                fractured system.
              </p>
            </div>
          </div>
        </div>
        {/** Team */}
        <div
          id='team'
          className='bg-cream flex flex-col h-full md:h-[50vh] justify-center'
        >
          <div className='m-8 text-center'>
            <h1 className='text-primary'>Meet Our Team</h1>
          </div>

          <div className='flex flex-col md:flex-row justify-evenly'>
            <div className='flex flex-col justify-center items-center space-y-4 py-5 lg:py-0'>
              <img
                src={Lakeisha}
                alt='Lakeisha Henry'
                className='h-36 w-36 rounded-full'
              />
              <h3 className='text-primary'>Lakeisha Henry</h3>
              <p className='text-base text-center'>Co-Founder & Co-CEO</p>
            </div>
            <div className='flex flex-col justify-center items-center space-y-4 py-5 lg:py-0'>
              <img
                src={Richard}
                alt='Richard Adams'
                className='h-36 w-36 rounded-full'
              />
              <h3 className='text-primary'>Richard Adams</h3>

              <p className='text-base text-center'>Co-Founder & Co-CEO</p>
            </div>
            <div className='flex flex-col justify-center items-center space-y-4 py-5 lg:py-0'>
              <img
                src={Steven}
                alt='for you icon'
                className='h-36 w-36 rounded-full'
              />
              <h3 className='text-primary'>Steven Arce</h3>

              <p className='text-base text-center'>Software Engineer</p>
            </div>
            <div className='flex flex-col justify-center items-center space-y-4 py-5 lg:py-0'>
              <img
                src={Derick}
                alt='Derick Pineda'
                className='h-36 w-36 rounded-full'
              />
              <h3 className='text-primary'>Derick Pineda</h3>

              <p className='text-base text-center'>Software Engineer</p>
            </div>
          </div>
        </div>
        {/** Footer */}
        <div
          id='footer'
          className='flex flex-col items-center content-around bg-palecream w-full py-10'
        >
          <img src={MillennicareLogoText} className='h-fit w-fit' />
          <p className='text-sm pt-2'>Copyright © 2023 MillenniCare, Inc.</p>
          {/* Footer Links */}
          <div className='flex flex-col min-[420px]:flex-row items-center justify-between w-[390px] pt-2'>
            {/* ----------------- Need to Add Links to Footer ------------------ */}
            <Link to='/eula'>
              <p className='hover:text-primary'>Terms of Service</p>
            </Link>
            <p className='max-[420px]:hidden'>|</p>
            <Link to='/privacy'>
              <p className='max-[420px]:py-2 hover:text-primary'>
                Privacy Policy
              </p>
            </Link>
            <p className='max-[420px]:hidden hover:text-primary'>|</p>
            <Link to=''>
              <p>Contact Us</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
