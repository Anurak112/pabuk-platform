import React from 'react';

export default function PabukLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">
              <span className="text-yellow-400">Pabuk</span>
              <span className="text-white">.ai</span>
            </div>
            <div className="flex gap-6">
              <a href="#home" className="text-white hover:text-yellow-400 transition-all duration-300 text-lg font-semibold">
                หน้าหลัก
              </a>
              <a href="#vision" className="text-white hover:text-yellow-400 transition-all duration-300 text-lg font-semibold">
                วิสัยทัศน์
              </a>
              <a href="#roadmap" className="text-white hover:text-yellow-400 transition-all duration-300 text-lg font-semibold">
                แผนงาน
              </a>
              <a href="#documents" className="text-white hover:text-yellow-400 transition-all duration-300 text-lg font-semibold">
                เอกสาร
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-20">
        <HomePage />
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-block px-6 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-4">
              Empowering Thailand's Digital Future
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black leading-tight">
              <span className="text-yellow-400 drop-shadow-2xl">Pabuk.ai</span>
            </h1>
            
            <p className="text-4xl md:text-5xl font-bold text-white/90 leading-tight max-w-5xl mx-auto">
              การสร้างคลังข้อมูลโอเพนซอร์สของไทย<br />
              เพื่อการพัฒนา AI
            </p>
            
            <p className="text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              ระบบนิเวศข้อมูลวัฒนธรรมแบบกระจายศูนย์ที่ขับเคลื่อนโดยชุมชน
              สำหรับทั้ง 77 จังหวัดของประเทศไทย
            </p>

            <div className="pt-8 flex justify-center gap-6">
              <button className="px-8 py-4 bg-yellow-400 text-slate-900 font-bold text-xl rounded-xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-yellow-400/50">
                เข้าร่วมชุมชน
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-xl rounded-xl hover:bg-white/20 transition-all duration-300 border-2 border-white/30">
                เรียนรู้เพิ่มเติม
              </button>
            </div>

            {/* Document Downloads */}
            <div className="pt-12 max-w-4xl mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-lg border-2 border-yellow-400/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center flex items-center justify-center gap-3">
                  <span>📚</span> Documentation & Whitepapers
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Thai Whitepaper */}
                  <a
                    href="/mnt/user-data/uploads/Pabuk_ai_การสร_างคล_งข_อม_ลโอเพนซอร_สของไทยเพ__อการพ_ฒนา_AI.pdf"
                    download
                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-900/50 to-slate-900/50 rounded-xl border border-blue-400/30 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 group"
                  >
                    <div className="text-4xl group-hover:scale-110 transition-transform">🇹🇭</div>
                    <div className="text-center">
                      <div className="font-bold text-blue-300 mb-1">Whitepaper</div>
                      <div className="text-sm text-blue-200">ฉบับภาษาไทย (PDF)</div>
                    </div>
                    <div className="text-xs text-blue-300 bg-blue-900/30 px-3 py-1 rounded-full">
                      ดาวน์โหลด ⬇
                    </div>
                  </a>

                  {/* English Whitepaper */}
                  <a
                    href="/mnt/user-data/uploads/Pabuk_ai_Building_an_Open-Source_Thai_Data_House_for_AI_Development.pdf"
                    download
                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-purple-900/50 to-slate-900/50 rounded-xl border border-purple-400/30 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 group"
                  >
                    <div className="text-4xl group-hover:scale-110 transition-transform">🌐</div>
                    <div className="text-center">
                      <div className="font-bold text-purple-300 mb-1">Whitepaper</div>
                      <div className="text-sm text-purple-200">English Version (PDF)</div>
                    </div>
                    <div className="text-xs text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full">
                      Download ⬇
                    </div>
                  </a>

                  {/* Executive Summary */}
                  <a
                    href="/mnt/user-data/uploads/Executive_Summary_Pabuk_ai___Building_an_Open-Source_Thai_Data_House_for_AI_Development.pdf"
                    download
                    className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-green-900/50 to-slate-900/50 rounded-xl border border-green-400/30 hover:border-green-400 transition-all duration-300 transform hover:scale-105 group"
                  >
                    <div className="text-4xl group-hover:scale-110 transition-transform">📄</div>
                    <div className="text-center">
                      <div className="font-bold text-green-300 mb-1">Executive Summary</div>
                      <div className="text-sm text-green-200">English (PDF)</div>
                    </div>
                    <div className="text-xs text-green-300 bg-green-900/30 px-3 py-1 rounded-full">
                      Download ⬇
                    </div>
                  </a>
                </div>

                <div className="mt-6 text-center text-sm text-blue-200">
                  <p>📖 รายละเอียดทั้งหมดเกี่ยวกับวิสัยทัศน์ เทคโนโลยี และแผนการดำเนินงาน</p>
                  <p className="text-xs mt-1 text-blue-300">Complete details about vision, technology, and implementation roadmap</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated decorative elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">
              ช่องว่างที่<span className="text-yellow-400">สำคัญ</span>ในระบบนิเวศ AI ของไทย
            </h2>
            <div className="w-32 h-2 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌍',
                title: 'การครอบงำของข้อมูลตะวันตก',
                desc: 'ชุดข้อมูลโอเพนซอร์สส่วนใหญ่ถูกครอบงำด้วยภาษาอังกฤษหรือแหล่งข้อมูลตะวันตก ทำให้โมเดล AI ของไทยขาดความเข้าใจในบริบทท้องถิ่น'
              },
              {
                icon: '🧩',
                title: 'ทรัพยากรที่กระจัดกระจาย',
                desc: 'ชุดข้อมูลภาษาไทยที่มีอยู่มุ่งเน้นไปที่ข่าวทั่วไปหรือโซเชียลมีเดีย โดยละเลยวัฒนธรรมเชิงลึกและประเพณีของแต่ละจังหวัด'
              },
              {
                icon: '🗣️',
                title: 'ความขาดแคลนภาษาถิ่น',
                desc: 'ข้อมูลคุณภาพสูงสำหรับภาษาถิ่นส่วนใหญ่ของประเทศไทยยังขาดแคลนอย่างมาก ขัดขวางการพัฒนา AI ที่ครอบคลุมทุกภูมิภาค'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border-2 border-yellow-400/20 hover:border-yellow-400/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-400/20"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-6xl mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">{item.title}</h3>
                <p className="text-blue-100 text-lg leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900/50 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(251, 191, 36, 0.1) 10px, rgba(251, 191, 36, 0.1) 20px)'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">
              วิสัยทัศน์: <span className="text-yellow-400">คลังข้อมูลวัฒนธรรม</span><br />แบบกระจายศูนย์
            </h2>
            <div className="w-32 h-2 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🗺️',
                title: 'การเป็นตัวแทนของจังหวัด',
                desc: 'การรวบรวมมุมมอง ประเพณี และภาษาถิ่นที่เป็นเอกลักษณ์ของทั้ง 77 จังหวัด'
              },
              {
                icon: '👥',
                title: 'ขับเคลื่อนโดยชุมชน',
                desc: 'ส่งเสริมให้ผู้มีส่วนร่วมในท้องถิ่นแบ่งปันมรดกทางวัฒนธรรมและความหลากหลายทางภาษา'
              },
              {
                icon: '🛡️',
                title: 'รากฐานทางจริยธรรม',
                desc: 'สร้างขึ้นตั้งแต่ต้นเพื่อให้สอดคล้องกับกฎหมายและเคารพต่อบรรทัดฐานทางวัฒนธรรม'
              },
              {
                icon: '💡',
                title: 'นวัตกรรมแบบเปิด',
                desc: 'การจัดหาข้อมูลดิบที่จำเป็นสำหรับการสร้างโมเดล AI ที่เข้าใจคนไทยอย่างแท้จริง'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-400/30 hover:bg-slate-800/80 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-yellow-400">{item.title}</h3>
                <p className="text-blue-100 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Collection Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">
              กรอบการรวบรวมข้อมูล: <span className="text-yellow-400">สิ่งที่เรารวบรวม</span>
            </h2>
            <div className="w-32 h-2 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '📝',
                title: 'เนื้อหาข้อความ',
                items: ['นิทานพื้นบ้าน', 'สุภาษิต', 'ประวัติศาสตร์ท้องถิ่น', 'วลีภาษาถิ่น']
              },
              {
                icon: '🎵',
                title: 'คลิปเสียง',
                items: ['การบันทึกภาษาถิ่น', 'เพลงพื้นบ้าน', 'เสียงงานประเพณี']
              },
              {
                icon: '📸',
                title: 'สินทรัพย์ภาพ',
                items: ['สถานที่สำคัญ', 'ภูมิทัศน์', 'วัตถุทางวัฒนธรรม', 'อาหาร']
              },
              {
                icon: '🤖',
                title: 'ข้อมูลสังเคราะห์',
                items: ['ภาพที่สร้างโดย AI', 'ข้อความจำลอง', 'สภาพแวดล้อมท้องถิ่น']
              }
            ].map((category, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-blue-900/30 to-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border-2 border-yellow-400/30 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">{category.title}</h3>
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

      {/* Technology Section */}
      <section className="py-24 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">
              การใช้ AI เพื่อ<span className="text-yellow-400">ประสิทธิภาพ</span>ด้านต้นทุน
            </h2>
            <div className="w-32 h-2 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: '⚡',
                title: 'การสร้างข้อมูลสังเคราะห์',
                desc: 'ใช้ GANs และ Diffusion Models เพื่อสร้างตัวอย่างการฝึกอบรมที่รักษาความเป็นส่วนตัวและเสริมข้อมูลที่ขาดแคลน',
                color: 'from-yellow-400/20 to-orange-400/20'
              },
              {
                icon: '🔄',
                title: 'การเรียนรู้แบบถ่ายโอน',
                desc: 'การปรับแต่งโมเดลที่ฝึกไว้แล้ว เช่น multilingual BERT โดยใช้ LoRA เพื่อลดความต้องการในการประมวลผลอย่างมาก',
                color: 'from-blue-400/20 to-cyan-400/20'
              },
              {
                icon: '🎯',
                title: 'การกลั่นกรองอัตโนมัติ',
                desc: 'ใช้ NLP และ Computer Vision เพื่อตรวจจับและลบข้อมูลส่วนบุคคลหรือเนื้อหาที่ไม่เหมาะสมโดยอัตโนมัติ',
                color: 'from-purple-400/20 to-pink-400/20'
              },
              {
                icon: '🌐',
                title: 'การประมวลผลแบบกระจาย',
                desc: 'ใช้ฮาร์ดแวร์ที่ชุมชนบริจาคและเครดิตคลาวด์เพื่อลดค่าใช้จ่ายทางการเงินในการฝึกโมเดล',
                color: 'from-green-400/20 to-emerald-400/20'
              }
            ].map((tech, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${tech.color} backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-yellow-400/50 transition-all duration-300`}
              >
                <div className="text-6xl mb-4">{tech.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">{tech.title}</h3>
                <p className="text-blue-100 text-lg leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-blue-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">
              แผนงานการดำเนินการ: <span className="text-yellow-400">5 ระยะ</span>
            </h2>
            <div className="w-32 h-2 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6">
            {[
              {
                phase: 'ระยะที่ 0',
                title: 'การจัดตั้งธรรมาภิบาล',
                time: 'เดือนที่ 1-2',
                items: ['จดทะเบียนมูลนิธิไม่แสวงหาผลกำไร', 'ร่างข้อตกลงและนโยบายความเป็นส่วนตัว', 'เลือกใบอนุญาตแบบผ่อนปรน']
              },
              {
                phase: 'ระยะที่ 1',
                title: 'โครงสร้างพื้นฐานและข้อมูลพื้นฐาน',
                time: 'เดือนที่ 2-4',
                items: ['สร้างแพลตฟอร์มหลัก', 'สร้างชุดข้อมูลพื้นฐานแบบสังเคราะห์', 'เผยแพร่เวอร์ชันอัลฟ่า']
              },
              {
                phase: 'ระยะที่ 2',
                title: 'การเข้าถึงชุมชน',
                time: 'เดือนที่ 4-8',
                items: ['เป็นพันธมิตรกับมหาวิทยาลัย', 'จัดเวิร์กช็อปการรวบรวมข้อมูล', 'เปิดตัวเบต้าสาธารณะ']
              },
              {
                phase: 'ระยะที่ 3',
                title: 'การพัฒนาโมเดล',
                time: 'เดือนที่ 6-12',
                items: ['ปรับแต่งโมเดลภาษาและภาพ', 'ใช้การเรียนรู้แบบถ่ายโอน', 'เผยแพร่โมเดลพื้นฐาน']
              },
              {
                phase: 'ระยะที่ 4',
                title: 'การเปิดตัวเบต้า',
                time: 'เดือนที่ 10-18',
                items: ['เปิดตัวอย่างเป็นทางการ', 'ประกาศเกียรติคุณผู้ก่อตั้ง', 'ปรับปรุงตามข้อเสนอแนะ']
              },
              {
                phase: 'ระยะที่ 5',
                title: 'การขยายและความยั่งยืน',
                time: 'ปีที่ 2 เป็นต้นไป',
                items: ['ขยายครอบคลุมทั้ง 77 จังหวัด', 'สร้างพันธมิตรระยะยาว', 'รักษาการปฏิบัติตามกฎระเบียบ']
              }
            ].map((phase, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-slate-800/50 to-blue-900/30 backdrop-blur-sm p-8 rounded-2xl border-l-4 border-yellow-400 hover:border-l-8 transition-all duration-300 transform hover:translate-x-2"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center gap-4 mb-2 md:mb-0">
                    <div className="text-5xl font-black text-yellow-400">{phase.phase}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{phase.title}</h3>
                      <p className="text-blue-300">{phase.time}</p>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {phase.items.map((item, i) => (
                    <div key={i} className="flex items-center bg-slate-900/50 p-3 rounded-lg">
                      <span className="text-yellow-400 mr-2">✓</span>
                      <span className="text-blue-100">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900/50 to-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">
              การให้รางวัลแก่<span className="text-yellow-400">ผู้สนับสนุน</span>ที่มีวิสัยทัศน์
            </h2>
            <div className="w-32 h-2 bg-yellow-400 mx-auto rounded-full"></div>
            <p className="text-2xl text-blue-200 mt-6">
              Pabuk.ai สร้างขึ้นจากการมีส่วนร่วมของชุมชน<br />
              เราตระหนักและให้รางวัลแก่ผู้ที่ช่วยสร้างรากฐานของ AI ไทย
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🏆',
                title: 'การยอมรับต่อสาธารณะ',
                desc: 'การนำเสนอผู้มีส่วนร่วมหลักบนเว็บไซต์โครงการและในเอกสารทางการ'
              },
              {
                icon: '🚀',
                title: 'การเข้าถึงก่อนใคร',
                desc: 'ผู้ก่อตั้งเข้าถึงคุณสมบัติเบต้า ชุดข้อมูลดิบ และโมเดล AI ก่อนใคร'
              },
              {
                icon: '🗳️',
                title: 'บทบาทในการกำกับดูแล',
                desc: 'สิทธิ์ในการลงคะแนนเสียงในการกำหนดทิศทางโครงการและนโยบาย'
              },
              {
                icon: '🎖️',
                title: 'ข้อมูลรับรองดิจิทัล',
                desc: 'ป้ายดิจิทัลหรือใบรับรองที่ตรวจสอบได้เพื่อรับรองการมีส่วนร่วม'
              }
            ].map((reward, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-yellow-400/10 to-orange-400/10 backdrop-blur-sm p-6 rounded-2xl border-2 border-yellow-400/30 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{reward.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-yellow-400">{reward.title}</h3>
                <p className="text-blue-100 leading-relaxed">{reward.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-yellow-400 to-orange-400 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0, 0, 0, 0.1) 20px, rgba(0, 0, 0, 0.1) 40px)'
          }}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-6xl font-black text-slate-900 mb-8">
            เข้าร่วมการเคลื่อนไหว<br />สร้างอนาคตของ AI ไทย
          </h2>
          <p className="text-2xl text-slate-800 mb-12 leading-relaxed">
            อนาคตของ AI ไทยควรสร้างโดยคนไทย เพื่อคนไทย<br />
            อนาคตนั้นเริ่มต้นที่ Pabuk.ai
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-12 py-5 bg-slate-900 text-white font-bold text-2xl rounded-2xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              เข้าร่วมตอนนี้
            </button>
            <button className="px-12 py-5 bg-white text-slate-900 font-bold text-2xl rounded-2xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              ดูเอกสาร Whitepaper
            </button>
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
    </>
  );
}

