import '../App.css'

function App() {
return ( <div className="min-h-screen bg-[#FFF9F5] text-[#292124]">


  {/* Navbar */}
  <nav className="flex items-center justify-between px-8 md:px-16 py-5 bg-white shadow-sm">
    <h1 className="text-3xl font-bold text-[#800020] tracking-wide">
      Vitalis<span className="text-[#E8A0A8]">.</span>
    </h1>

    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
      <a href="#home" className="hover:text-[#800020]">Home</a>
      <a href="#about" className="hover:text-[#800020]">About Us</a>
      <a href="#how" className="hover:text-[#800020]">How It Works</a>
    </div>

    <button className="bg-[#800020] text-white px-6 py-2.5 rounded-full hover:bg-[#4A1428] transition">
      Login
    </button>
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
          <button className="bg-[#800020] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#4A1428] transition">
            Become a Donor
          </button>

          <button className="border-2 border-[#800020] text-[#800020] px-8 py-3.5 rounded-lg font-semibold hover:bg-[#800020] hover:text-white transition">
            Hospital Portal
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          A platform built around compassion, connection and care.
        </p>
      </div>

      {/* Right Side Visual */}
      <div className="relative">
        <div className="bg-[#F4DDE1] rounded-[40px] p-12 min-h-[380px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-9xl text-[#800020]">♥</div>

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

  {/* Footer */}
  <footer className="bg-[#4A1428] text-white text-center py-7">
    <h2 className="text-2xl font-bold">Vitalis.</h2>

    <p className="text-sm text-[#F4DDE1] mt-2">
      Understand Health. Connect Lives. Make a Difference.
    </p>

    <p className="text-xs text-[#E8A0A8] mt-4">
      © 2026 Vitalis. All rights reserved.
    </p>
  </footer>

</div>


)
}

export default App
