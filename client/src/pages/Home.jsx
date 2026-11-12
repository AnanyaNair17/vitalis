import '../App.css'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#292124]">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 md:px-16 py-5 bg-white shadow-sm">
        <Link to="/" className="text-3xl font-bold text-[#800020] tracking-wide">
          Vitalis<span className="text-[#E8A0A8]">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#home" className="hover:text-[#800020]">Home</a>
          <a href="#about" className="hover:text-[#800020]">About Us</a>
          <a href="#how" className="hover:text-[#800020]">How It Works</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="border border-[#800020] text-[#800020] px-6 py-2.5 rounded-full hover:bg-[#800020] hover:text-white transition"
          >
            Login
          </Link>

          <Link
            to="/hospital-register"
            className="bg-[#800020] text-white px-6 py-2.5 rounded-full hover:bg-[#4A1428] transition"
          >
            Hospital Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main id="home" className="max-w-7xl mx-auto px-8 md:px-16 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">

          <div>
            <p className="text-[#800020] font-semibold tracking-widest uppercase text-sm mb-5">
              Every Drop Matters
            </p>

            <h2 className="text-5xl md:text-6xl font-bold leading-tight text-[#4A1428]">
              Connecting Lives,
              <span className="text-[#B83250]"> One Drop</span> at a Time.
            </h2>

            <p className="mt-7 text-lg text-gray-600 leading-relaxed max-w-lg">
              Vitalis bridges the gap between blood donors and hospitals,
              making blood donation simpler, faster and more accessible.
              Because every second counts when a life is at stake.
            </p>

            <div className="flex flex-wrap gap-4 mt-9">

              <Link
                to="/donor-register"
                className="bg-[#800020] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#4A1428] transition"
              >
                Become a Donor
              </Link>

              <Link
                to="/hospital-register"
                className="border-2 border-[#800020] text-[#800020] px-8 py-3.5 rounded-lg font-semibold hover:bg-[#800020] hover:text-white transition"
              >
                Hospital Portal
              </Link>

            </div>

            <p className="mt-8 text-sm text-gray-500">
              A platform built around compassion, connection and care.
            </p>
          </div>

          {/* Right Side Visual */}
          <div className="relative">
            <div className="bg-[#F4DDE1] rounded-[40px] p-12 min-h-[380px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-[12rem] leading-none text-[#800020]">{'\u2665'}</div>

                <h3 className="text-3xl font-bold text-[#4A1428] mt-5">
                  Be Someone's Lifeline
                </h3>

                <p className="text-gray-600 mt-3">
                  Your donation can make a difference.
                </p>
              </div>
            </div>
          </div>

        </div>
</main>

      {/* Medical Disclaimer */}
      <section className="bg-[#FFF1E8] border-y border-[#F0D9D0] px-8 py-6 text-center">
        <p className="max-w-4xl mx-auto text-sm text-[#4A1428] leading-relaxed">
          <strong>Important Medical Disclaimer:</strong> Vitalis is a donor-hospital
          connection platform only. It does not collect, test, store, or transfuse
          blood and does not provide medical screening or eligibility clearance.
          All donor suitability and blood transfusion decisions must be made by
          qualified professionals at an authorized hospital or blood bank.
        </p>
      </section>
      {/* About Section */}
      <section id="about" className="bg-white py-16 px-8 text-center">
        <p className="text-[#800020] uppercase tracking-widest text-sm font-semibold">
          Why Vitalis?
        </p>

        <h2 className="text-3xl font-bold text-[#4A1428] mt-3">
          Making Every Connection Count
        </h2>

        <p className="max-w-2xl mx-auto mt-5 text-gray-600 leading-relaxed">
          We aim to create a reliable connection between verified blood donors
          and hospitals through a simple and accessible digital platform.
        </p>
      </section>

      {/* How It Works */}
      <section id="how" className="py-16 px-8 md:px-16 text-center">
        <h2 className="text-3xl font-bold text-[#4A1428]">
          How Vitalis Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-12">

          {[
            ['01', 'Register', 'Donors and hospitals create their accounts.'],
            ['02', 'Connect', 'Hospitals submit requests for required blood groups.'],
            ['03', 'Save Lives', 'The platform identifies compatible available donors.']
          ].map(([number, title, description]) => (
            <div
              key={number}
              className="bg-white p-8 rounded-2xl shadow-sm border border-[#F0E3E5]"
            >
              <span className="text-4xl font-bold text-[#E8A0A8]">
                {number}
              </span>

              <h3 className="text-xl font-bold text-[#800020] mt-4">
                {title}
              </h3>

              <p className="text-gray-600 mt-3">
                {description}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* Project Navigation */}
      <section className="bg-white py-16 px-8 md:px-16">
        <h2 className="text-3xl font-bold text-[#4A1428] text-center">
          Explore Vitalis
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10">

          <Link
            to="/hospital-register"
            className="p-7 rounded-2xl border border-[#F0E3E5] hover:shadow-lg transition text-center"
          >
            <h3 className="text-xl font-bold text-[#800020]">
              Hospital Registration
            </h3>
            <p className="text-gray-600 mt-3">
              Register your hospital with Vitalis.
            </p>
          </Link>

          <Link
            to="/create-request"
            className="p-7 rounded-2xl border border-[#F0E3E5] hover:shadow-lg transition text-center"
          >
            <h3 className="text-xl font-bold text-[#800020]">
              Create Blood Request
            </h3>
            <p className="text-gray-600 mt-3">
              Submit a request for the required blood group.
            </p>
          </Link>

          <Link
            to="/matches"
            className="p-7 rounded-2xl border border-[#F0E3E5] hover:shadow-lg transition text-center"
          >
            <h3 className="text-xl font-bold text-[#800020]">
              Match Results
            </h3>
            <p className="text-gray-600 mt-3">
              View compatible donor matches.
            </p>
          </Link>

          <Link
            to="/donor-availability"
            className="p-7 rounded-2xl border border-[#F0E3E5] hover:shadow-lg transition text-center md:col-span-3"
          >
            <h3 className="text-xl font-bold text-[#800020]">
              Donor Availability
            </h3>
            <p className="text-gray-600 mt-3">
              Manage your availability as a donor.
            </p>
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4A1428] text-white text-center py-7">
        <h2 className="text-2xl font-bold">Vitalis.</h2>

        <p className="text-sm text-[#F4DDE1] mt-2">
          Understand Health. Connect Lives. Make a Difference.
        </p>

        <p className="text-xs text-[#E8A0A8] mt-4">
          &#169; 2026 Vitalis. All rights reserved.
        </p>
      </footer>

    </div>
  )
}

export default Home
