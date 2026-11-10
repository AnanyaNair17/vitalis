function MatchResults() {
  const donors = [
    {
      name: 'Rahul Sharma',
      bloodGroup: 'O+',
      city: 'Mumbai',
      status: 'Available',
      distance: '2 km',
    },
    {
      name: 'Priya Mehta',
      bloodGroup: 'O+',
      city: 'Mumbai',
      status: 'Available',
      distance: '5 km',
    },
    {
      name: 'Aarav Patel',
      bloodGroup: 'O+',
      city: 'Mumbai',
      status: 'Available',
      distance: '8 km',
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFF9F5] px-6 py-12">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-[#800020]">
          Compatible Donors
        </h1>

        <p className="text-gray-500 mt-2">
          Donors ranked based on blood compatibility and location.
        </p>

        <div className="bg-white rounded-xl p-5 mt-8 shadow-sm border border-[#F0E3E5]">
          <p className="text-gray-500 text-sm">Blood group required</p>
          <h2 className="text-2xl font-bold text-[#800020] mt-1">
            O Positive (O+)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Location: Mumbai
          </p>
        </div>

        <h2 className="text-xl font-bold text-[#4A1428] mt-10 mb-5">
          Top Matching Donors
        </h2>

        <div className="space-y-4">

          {donors.map((donor, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#F0E3E5] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-full bg-[#F4DDE1] flex items-center justify-center text-[#800020] font-bold text-xl">
                  {donor.name.charAt(0)}
                </div>

                <div>
                  <h3 className="font-bold text-lg text-[#4A1428]">
                    {donor.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {donor.city} • {donor.distance} away
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-5">

                <span className="bg-[#F4DDE1] text-[#800020] px-4 py-2 rounded-lg font-bold">
                  {donor.bloodGroup}
                </span>

                <span className="text-green-600 font-semibold text-sm">
                  ● {donor.status}
                </span>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  )
}

export default MatchResults