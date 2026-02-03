export default function StatsBar() {
  return (
    <section className="bg-off-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 text-center bg-white py-8 -mt-6 rounded-2xl shadow-lg max-w-3xl mx-auto relative z-10">
          <div>
            <p className="text-3xl lg:text-4xl font-black text-[#2D3E50]">
              780+
            </p>
            <p className="text-sm text-gray-500">Schools in our network</p>
          </div>
          <div>
            <p className="text-3xl lg:text-4xl font-black text-[#2D3E50]">
              K–12
            </p>
            <p className="text-sm text-gray-500">Kindy through Year 12</p>
          </div>
          <div>
            <p className="text-3xl lg:text-4xl font-black text-[#2D3E50]">
              100%
            </p>
            <p className="text-sm text-gray-500">Online. Fully digital.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
