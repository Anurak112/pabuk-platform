import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold">
              <span className="text-yellow-400">Pabuk</span>
              <span className="text-white">.ai</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/catalogue" className="text-white hover:text-yellow-400 transition-all duration-300 font-semibold">
                คลังข้อมูล
              </Link>
              <Link href="/submit" className="text-white hover:text-yellow-400 transition-all duration-300 font-semibold">
                ส่งข้อมูล
              </Link>
              <Link href="/auth/signin" className="px-4 py-2 bg-yellow-400 text-slate-900 font-bold rounded-lg hover:bg-yellow-300 transition-all">
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
        }}></div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-block px-6 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-400 font-semibold text-sm uppercase tracking-wider">
              Empowering Thailand's Digital Future
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-tight">
              <span className="text-yellow-400 drop-shadow-2xl">Pabuk.ai</span>
            </h1>

            <p className="text-3xl md:text-4xl font-bold text-white/90 max-w-4xl mx-auto">
              การสร้างคลังข้อมูลโอเพนซอร์สของไทย<br />
              เพื่อการพัฒนา AI
            </p>

            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              ระบบนิเวศข้อมูลวัฒนธรรมแบบกระจายศูนย์ที่ขับเคลื่อนโดยชุมชน
              สำหรับทั้ง 77 จังหวัดของประเทศไทย
            </p>

            <div className="pt-8 flex justify-center gap-6">
              <Link href="/auth/register" className="px-8 py-4 bg-yellow-400 text-slate-900 font-bold text-xl rounded-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-yellow-400/50">
                เข้าร่วมชุมชน
              </Link>
              <Link href="/catalogue" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-xl rounded-xl hover:bg-white/20 transition-all duration-300 border-2 border-white/30">
                สำรวจคลังข้อมูล
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "77", label: "จังหวัด", sublabel: "Provinces" },
              { value: "3", label: "นำร่อง", sublabel: "Pilot Regions" },
              { value: "4", label: "ประเภทข้อมูล", sublabel: "Data Types" },
              { value: "∞", label: "โอกาส", sublabel: "Opportunities" },
            ].map((stat, idx) => (
              <div key={idx} className="p-6">
                <div className="text-5xl font-black text-yellow-400">{stat.value}</div>
                <div className="text-xl font-bold text-white mt-2">{stat.label}</div>
                <div className="text-blue-300 text-sm">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Types Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">
              สิ่งที่เรา<span className="text-yellow-400">รวบรวม</span>
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "📝",
                title: "เนื้อหาข้อความ",
                items: ["นิทานพื้นบ้าน", "สุภาษิต", "ประวัติศาสตร์ท้องถิ่น"],
              },
              {
                icon: "🎵",
                title: "คลิปเสียง",
                items: ["ภาษาถิ่น", "เพลงพื้นบ้าน", "เสียงงานประเพณี"],
              },
              {
                icon: "📸",
                title: "สินทรัพย์ภาพ",
                items: ["สถานที่สำคัญ", "อาหาร", "วัตถุทางวัฒนธรรม"],
              },
              {
                icon: "🤖",
                title: "ข้อมูลสังเคราะห์",
                items: ["ภาพที่สร้างโดย AI", "ข้อความจำลอง"],
              },
            ].map((category, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-blue-900/30 to-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border-2 border-yellow-400/30 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-yellow-400">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span className="text-blue-100">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-yellow-400 to-orange-400">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black text-slate-900 mb-6">
            เข้าร่วมการเคลื่อนไหว
          </h2>
          <p className="text-xl text-slate-800 mb-8">
            อนาคตของ AI ไทยควรสร้างโดยคนไทย เพื่อคนไทย
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/register" className="px-10 py-4 bg-slate-900 text-white font-bold text-xl rounded-xl hover:bg-slate-800 transition-all">
              สมัครเป็นผู้ร่วมสร้าง
            </Link>
            <Link href="/submit" className="px-10 py-4 bg-white text-slate-900 font-bold text-xl rounded-xl hover:bg-slate-100 transition-all">
              ส่งข้อมูลแรกของคุณ
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold mb-4 md:mb-0">
              <span className="text-yellow-400">Pabuk</span>
              <span className="text-white">.ai</span>
            </div>
            <div className="text-blue-200">
              © 2026 Pabuk.ai - Empowering Thailand's Digital Future
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
