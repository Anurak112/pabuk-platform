// Complete list of all 77 Thai provinces with regions
export interface Province {
    id: string;
    nameEn: string;
    nameTh: string;
    region: "NORTH" | "NORTHEAST" | "CENTRAL" | "EAST" | "WEST" | "SOUTH";
}

export const THAI_PROVINCES: Province[] = [
    // ภาคเหนือ (North) - 9 provinces
    { id: "chiang-mai", nameEn: "Chiang Mai", nameTh: "เชียงใหม่", region: "NORTH" },
    { id: "chiang-rai", nameEn: "Chiang Rai", nameTh: "เชียงราย", region: "NORTH" },
    { id: "lampang", nameEn: "Lampang", nameTh: "ลำปาง", region: "NORTH" },
    { id: "lamphun", nameEn: "Lamphun", nameTh: "ลำพูน", region: "NORTH" },
    { id: "mae-hong-son", nameEn: "Mae Hong Son", nameTh: "แม่ฮ่องสอน", region: "NORTH" },
    { id: "nan", nameEn: "Nan", nameTh: "น่าน", region: "NORTH" },
    { id: "phayao", nameEn: "Phayao", nameTh: "พะเยา", region: "NORTH" },
    { id: "phrae", nameEn: "Phrae", nameTh: "แพร่", region: "NORTH" },
    { id: "uttaradit", nameEn: "Uttaradit", nameTh: "อุตรดิตถ์", region: "NORTH" },

    // ภาคตะวันออกเฉียงเหนือ (Northeast/Isan) - 20 provinces
    { id: "kalasin", nameEn: "Kalasin", nameTh: "กาฬสินธุ์", region: "NORTHEAST" },
    { id: "khon-kaen", nameEn: "Khon Kaen", nameTh: "ขอนแก่น", region: "NORTHEAST" },
    { id: "chaiyaphum", nameEn: "Chaiyaphum", nameTh: "ชัยภูมิ", region: "NORTHEAST" },
    { id: "nakhon-phanom", nameEn: "Nakhon Phanom", nameTh: "นครพนม", region: "NORTHEAST" },
    { id: "nakhon-ratchasima", nameEn: "Nakhon Ratchasima", nameTh: "นครราชสีมา", region: "NORTHEAST" },
    { id: "bueng-kan", nameEn: "Bueng Kan", nameTh: "บึงกาฬ", region: "NORTHEAST" },
    { id: "buriram", nameEn: "Buriram", nameTh: "บุรีรัมย์", region: "NORTHEAST" },
    { id: "maha-sarakham", nameEn: "Maha Sarakham", nameTh: "มหาสารคาม", region: "NORTHEAST" },
    { id: "mukdahan", nameEn: "Mukdahan", nameTh: "มุกดาหาร", region: "NORTHEAST" },
    { id: "yasothon", nameEn: "Yasothon", nameTh: "ยโสธร", region: "NORTHEAST" },
    { id: "roi-et", nameEn: "Roi Et", nameTh: "ร้อยเอ็ด", region: "NORTHEAST" },
    { id: "loei", nameEn: "Loei", nameTh: "เลย", region: "NORTHEAST" },
    { id: "sisaket", nameEn: "Sisaket", nameTh: "ศรีสะเกษ", region: "NORTHEAST" },
    { id: "sakon-nakhon", nameEn: "Sakon Nakhon", nameTh: "สกลนคร", region: "NORTHEAST" },
    { id: "surin", nameEn: "Surin", nameTh: "สุรินทร์", region: "NORTHEAST" },
    { id: "nong-khai", nameEn: "Nong Khai", nameTh: "หนองคาย", region: "NORTHEAST" },
    { id: "nong-bua-lamphu", nameEn: "Nong Bua Lamphu", nameTh: "หนองบัวลำภู", region: "NORTHEAST" },
    { id: "udon-thani", nameEn: "Udon Thani", nameTh: "อุดรธานี", region: "NORTHEAST" },
    { id: "ubon-ratchathani", nameEn: "Ubon Ratchathani", nameTh: "อุบลราชธานี", region: "NORTHEAST" },
    { id: "amnat-charoen", nameEn: "Amnat Charoen", nameTh: "อำนาจเจริญ", region: "NORTHEAST" },

    // ภาคกลาง (Central) - 22 provinces
    { id: "bangkok", nameEn: "Bangkok", nameTh: "กรุงเทพมหานคร", region: "CENTRAL" },
    { id: "kamphaeng-phet", nameEn: "Kamphaeng Phet", nameTh: "กำแพงเพชร", region: "CENTRAL" },
    { id: "chai-nat", nameEn: "Chai Nat", nameTh: "ชัยนาท", region: "CENTRAL" },
    { id: "nakhon-nayok", nameEn: "Nakhon Nayok", nameTh: "นครนายก", region: "CENTRAL" },
    { id: "nakhon-pathom", nameEn: "Nakhon Pathom", nameTh: "นครปฐม", region: "CENTRAL" },
    { id: "nakhon-sawan", nameEn: "Nakhon Sawan", nameTh: "นครสวรรค์", region: "CENTRAL" },
    { id: "nonthaburi", nameEn: "Nonthaburi", nameTh: "นนทบุรี", region: "CENTRAL" },
    { id: "pathum-thani", nameEn: "Pathum Thani", nameTh: "ปทุมธานี", region: "CENTRAL" },
    { id: "phra-nakhon-si-ayutthaya", nameEn: "Phra Nakhon Si Ayutthaya", nameTh: "พระนครศรีอยุธยา", region: "CENTRAL" },
    { id: "phichit", nameEn: "Phichit", nameTh: "พิจิตร", region: "CENTRAL" },
    { id: "phitsanulok", nameEn: "Phitsanulok", nameTh: "พิษณุโลก", region: "CENTRAL" },
    { id: "phetchabun", nameEn: "Phetchabun", nameTh: "เพชรบูรณ์", region: "CENTRAL" },
    { id: "lop-buri", nameEn: "Lop Buri", nameTh: "ลพบุรี", region: "CENTRAL" },
    { id: "samut-prakan", nameEn: "Samut Prakan", nameTh: "สมุทรปราการ", region: "CENTRAL" },
    { id: "samut-sakhon", nameEn: "Samut Sakhon", nameTh: "สมุทรสาคร", region: "CENTRAL" },
    { id: "samut-songkhram", nameEn: "Samut Songkhram", nameTh: "สมุทรสงคราม", region: "CENTRAL" },
    { id: "saraburi", nameEn: "Saraburi", nameTh: "สระบุรี", region: "CENTRAL" },
    { id: "sing-buri", nameEn: "Sing Buri", nameTh: "สิงห์บุรี", region: "CENTRAL" },
    { id: "sukhothai", nameEn: "Sukhothai", nameTh: "สุโขทัย", region: "CENTRAL" },
    { id: "suphan-buri", nameEn: "Suphan Buri", nameTh: "สุพรรณบุรี", region: "CENTRAL" },
    { id: "ang-thong", nameEn: "Ang Thong", nameTh: "อ่างทอง", region: "CENTRAL" },
    { id: "uthai-thani", nameEn: "Uthai Thani", nameTh: "อุทัยธานี", region: "CENTRAL" },

    // ภาคตะวันออก (East) - 7 provinces
    { id: "chanthaburi", nameEn: "Chanthaburi", nameTh: "จันทบุรี", region: "EAST" },
    { id: "chachoengsao", nameEn: "Chachoengsao", nameTh: "ฉะเชิงเทรา", region: "EAST" },
    { id: "chon-buri", nameEn: "Chon Buri", nameTh: "ชลบุรี", region: "EAST" },
    { id: "trat", nameEn: "Trat", nameTh: "ตราด", region: "EAST" },
    { id: "prachin-buri", nameEn: "Prachin Buri", nameTh: "ปราจีนบุรี", region: "EAST" },
    { id: "rayong", nameEn: "Rayong", nameTh: "ระยอง", region: "EAST" },
    { id: "sa-kaeo", nameEn: "Sa Kaeo", nameTh: "สระแก้ว", region: "EAST" },

    // ภาคตะวันตก (West) - 5 provinces
    { id: "tak", nameEn: "Tak", nameTh: "ตาก", region: "WEST" },
    { id: "kanchanaburi", nameEn: "Kanchanaburi", nameTh: "กาญจนบุรี", region: "WEST" },
    { id: "ratchaburi", nameEn: "Ratchaburi", nameTh: "ราชบุรี", region: "WEST" },
    { id: "phetchaburi", nameEn: "Phetchaburi", nameTh: "เพชรบุรี", region: "WEST" },
    { id: "prachuap-khiri-khan", nameEn: "Prachuap Khiri Khan", nameTh: "ประจวบคีรีขันธ์", region: "WEST" },

    // ภาคใต้ (South) - 14 provinces
    { id: "krabi", nameEn: "Krabi", nameTh: "กระบี่", region: "SOUTH" },
    { id: "chumphon", nameEn: "Chumphon", nameTh: "ชุมพร", region: "SOUTH" },
    { id: "trang", nameEn: "Trang", nameTh: "ตรัง", region: "SOUTH" },
    { id: "nakhon-si-thammarat", nameEn: "Nakhon Si Thammarat", nameTh: "นครศรีธรรมราช", region: "SOUTH" },
    { id: "narathiwat", nameEn: "Narathiwat", nameTh: "นราธิวาส", region: "SOUTH" },
    { id: "pattani", nameEn: "Pattani", nameTh: "ปัตตานี", region: "SOUTH" },
    { id: "phang-nga", nameEn: "Phang Nga", nameTh: "พังงา", region: "SOUTH" },
    { id: "phatthalung", nameEn: "Phatthalung", nameTh: "พัทลุง", region: "SOUTH" },
    { id: "phuket", nameEn: "Phuket", nameTh: "ภูเก็ต", region: "SOUTH" },
    { id: "yala", nameEn: "Yala", nameTh: "ยะลา", region: "SOUTH" },
    { id: "ranong", nameEn: "Ranong", nameTh: "ระนอง", region: "SOUTH" },
    { id: "songkhla", nameEn: "Songkhla", nameTh: "สงขลา", region: "SOUTH" },
    { id: "satun", nameEn: "Satun", nameTh: "สตูล", region: "SOUTH" },
    { id: "surat-thani", nameEn: "Surat Thani", nameTh: "สุราษฎร์ธานี", region: "SOUTH" },
];

export const REGIONS = [
    { value: "NORTH", labelTh: "ภาคเหนือ", labelEn: "North" },
    { value: "NORTHEAST", labelTh: "ภาคตะวันออกเฉียงเหนือ", labelEn: "Northeast" },
    { value: "CENTRAL", labelTh: "ภาคกลาง", labelEn: "Central" },
    { value: "EAST", labelTh: "ภาคตะวันออก", labelEn: "East" },
    { value: "WEST", labelTh: "ภาคตะวันตก", labelEn: "West" },
    { value: "SOUTH", labelTh: "ภาคใต้", labelEn: "South" },
];

// Helper function to get provinces by region
export const getProvincesByRegion = (region: Province["region"]) => {
    return THAI_PROVINCES.filter((p) => p.region === region);
};

// Helper function to get province by ID
export const getProvinceById = (id: string) => {
    return THAI_PROVINCES.find((p) => p.id === id);
};
