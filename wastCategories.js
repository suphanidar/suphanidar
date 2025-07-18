// Waste categories database with comprehensive information
export const wasteCategories = {
‘plastic-bottle’: {
type: ‘recyclable’,
color: ‘text-green-600’,
score: 10,
thai: ‘ขวดพลาสติก’,
english: ‘Plastic Bottle’,
icon: ‘🍼’,
recyclingCode: ‘PET #1’,
decompositionTime: ‘450 years’,
co2Saved: ‘1.5 kg per bottle’
},
‘plastic-bag’: {
type: ‘recyclable’,
color: ‘text-green-600’,
score: 5,
thai: ‘ถุงพลาสติก’,
english: ‘Plastic Bag’,
icon: ‘🛍️’,
recyclingCode: ‘LDPE #4’,
decompositionTime: ‘20 years’,
co2Saved: ‘0.5 kg per bag’
},
‘paper’: {
type: ‘recyclable’,
color: ‘text-blue-600’,
score: 8,
thai: ‘กระดาษ’,
english: ‘Paper’,
icon: ‘📄’,
recyclingCode: ‘PAP 20’,
decompositionTime: ‘2-6 weeks’,
co2Saved: ‘1.0 kg per kg’
},
‘cardboard’: {
type: ‘recyclable’,
color: ‘text-blue-600’,
score: 10,
thai: ‘กระดาษลัง’,
english: ‘Cardboard’,
icon: ‘📦’,
recyclingCode: ‘PAP 21’,
decompositionTime: ‘2 months’,
co2Saved: ‘1.1 kg per kg’
},
‘aluminum-can’: {
type: ‘recyclable’,
color: ‘text-purple-600’,
score: 15,
thai: ‘กระป็องอลูมิเนียม’,
english: ‘Aluminum Can’,
icon: ‘🥤’,
recyclingCode: ‘ALU 41’,
decompositionTime: ‘80-200 years’,
co2Saved: ‘9.0 kg per kg’
},
‘steel-can’: {
type: ‘recyclable’,
color: ‘text-gray-600’,
score: 12,
thai: ‘กระป็องเหล็ก’,
english: ‘Steel Can’,
icon: ‘🥫’,
recyclingCode: ‘FE 40’,
decompositionTime: ‘50 years’,
co2Saved: ‘1.5 kg per kg’
},
‘glass-bottle’: {
type: ‘recyclable’,
color: ‘text-emerald-600’,
score: 15,
thai: ‘ขวดแก้ว’,
english: ‘Glass Bottle’,
icon: ‘🍺’,
recyclingCode: ‘GL 70’,
decompositionTime: ‘1 million years’,
co2Saved: ‘0.3 kg per kg’
},
‘organic-waste’: {
type: ‘compost’,
color: ‘text-amber-600’,
score: 8,
thai: ‘ขยะอินทรีย์’,
english: ‘Organic Waste’,
icon: ‘🍌’,
recyclingCode: ‘ORG’,
decompositionTime: ‘2-5 weeks’,
co2Saved: ‘0.5 kg per kg’
},
‘food-waste’: {
type: ‘compost’,
color: ‘text-orange-600’,
score: 6,
thai: ‘เศษอาหาร’,
english: ‘Food Waste’,
icon: ‘🍽️’,
recyclingCode: ‘FOOD’,
decompositionTime: ‘1-3 weeks’,
co2Saved: ‘0.3 kg per kg’
},
‘electronic’: {
type: ‘hazardous’,
color: ‘text-red-600’,
score: 20,
thai: ‘อุปกรณ์อิเล็กทรอนิกส์’,
english: ‘Electronic Device’,
icon: ‘📱’,
recyclingCode: ‘WEEE’,
decompositionTime: ‘1000+ years’,
co2Saved: ‘50+ kg per device’
},
‘battery’: {
type: ‘hazardous’,
color: ‘text-red-700’,
score: 25,
thai: ‘แบตเตอรี่’,
english: ‘Battery’,
icon: ‘🔋’,
recyclingCode: ‘BATT’,
decompositionTime: ‘100+ years’,
co2Saved: ‘10+ kg per battery’
},
‘medical-waste’: {
type: ‘hazardous’,
color: ‘text-red-800’,
score: 30,
thai: ‘ขยะทางการแพทย์’,
english: ‘Medical Waste’,
icon: ‘💉’,
recyclingCode: ‘MED’,
decompositionTime: ‘Variable’,
co2Saved: ‘N/A’
},
‘fabric’: {
type: ‘non-recyclable’,
color: ‘text-gray-500’,
score: 3,
thai: ‘ผ้า’,
english: ‘Fabric’,
icon: ‘👕’,
recyclingCode: ‘TEX’,
decompositionTime: ‘6 months - 40 years’,
co2Saved: ‘0.1 kg per kg’
},
‘ceramic’: {
type: ‘non-recyclable’,
color: ‘text-stone-600’,
score: 2,
thai: ‘เซรามิก’,
english: ‘Ceramic’,
icon: ‘🏺’,
recyclingCode: ‘CER’,
decompositionTime: ‘1 million+ years’,
co2Saved: ‘0 kg’
},
‘rubber’: {
type: ‘special’,
color: ‘text-slate-600’,
score: 7,
thai: ‘ยาง’,
english: ‘Rubber’,
icon: ‘🛞’,
recyclingCode: ‘RUB’,
decompositionTime: ‘50-80 years’,
co2Saved: ‘2.0 kg per kg’
},
‘foam’: {
type: ‘special’,
color: ‘text-gray-400’,
score: 4,
thai: ‘โฟม’,
english: ‘Foam’,
icon: ‘🧽’,
recyclingCode: ‘EPS’,
decompositionTime: ‘500+ years’,
co2Saved: ‘0.2 kg per kg’
},
‘mixed-waste’: {
type: ‘general’,
color: ‘text-gray-700’,
score: 1,
thai: ‘ขยะรวม’,
english: ‘Mixed Waste’,
icon: ‘🗑️’,
recyclingCode: ‘MIX’,
decompositionTime: ‘Variable’,
co2Saved: ‘0 kg’
}
};

// Waste type information
export const wasteTypes = {
‘recyclable’: {
thai: ‘รีไซเคิล’,
english: ‘Recyclable’,
color: ‘text-green-600’,
bgColor: ‘bg-green-100’,
icon: ‘♻️’,
description: ‘สามารถนำไปรีไซเคิลได้’,
binColor: ‘เขียว’
},
‘compost’: {
thai: ‘ปุ่ยหมัก’,
english: ‘Compostable’,
color: ‘text-amber-600’,
bgColor: ‘bg-amber-100’,
icon: ‘🌱’,
description: ‘สามารถทำปุ่ยหมักได้’,
binColor: ‘น้ำตาล’
},
‘hazardous’: {
thai: ‘อันตราย’,
english: ‘Hazardous’,
color: ‘text-red-600’,
bgColor: ‘bg-red-100’,
icon: ‘☢️’,
description: ‘ขยะอันตรายต้องการการจัดการพิเศษ’,
binColor: ‘แดง’
},
‘non-recyclable’: {
thai: ‘ไม่รีไซเคิล’,
english: ‘Non-recyclable’,
color: ‘text-gray-600’,
bgColor: ‘bg-gray-100’,
icon: ‘🚫’,
description: ‘ไม่สามารถรีไซเคิลได้’,
binColor: ‘ดำ’
},
‘special’: {
thai: ‘พิเศษ’,
english: ‘Special Handling’,
color: ‘text-purple-600’,
bgColor: ‘bg-purple-100’,
icon: ‘⚠️’,
description: ‘ต้องการการจัดการพิเศษ’,
binColor: ‘ม่วง’
},
‘general’: {
thai: ‘ทั่วไป’,
english: ‘General Waste’,
color: ‘text-gray-700’,
bgColor: ‘bg-gray-200’,
icon: ‘🗑️’,
description: ‘ขยะทั่วไป’,
binColor: ‘ดำ’
}
};

// Recommendations for each category
export const recommendations = {
‘plastic-bottle’: [
‘ล้างขวดให้สะอาดก่อนทิ้ง’,
‘ถอดฝาและป้ายกาวออก’,
‘นำไปถังขยะรีไซเคิลสีเขียว’,
‘ลดการใช้โดยใช้ขวดน้ำส่วนตัว’
],
‘plastic-bag’: [
‘ตรวจสอบว่าสะอาดและแห้ง’,
‘นำไปจุดรวบรวมถุงพลาสติกพิเศษ’,
‘หลีกเลี่ยงการใช้ครั้งเดียวทิ้ง’,
‘นำกลับมาใช้ใหม่หลายครั้ง’
],
‘paper’: [
‘ตรวจสอบไม่มีคราบน้ำมันหรือสี’,
‘นำไปถังกระดาษสีน้ำเงิน’,
‘พับให้เล็กเพื่อประหยัดพื้นที่’,
‘ใช้กระดาษสองหน้าก่อนทิ้ง’
],
‘cardboard’: [
‘ปิดลาดเป็นแผ่นเล็ก’,
‘ถอดเทปและกาวออก’,
‘เก็บให้แห้งก่อนทิ้ง’,
‘นำไปถังรีไซเคิลสีน้ำเงิน’
],
‘aluminum-can’: [
‘ล้างให้สะอาดเพื่อป้องกันกลิ่น’,
‘บีบให้แบนเพื่อประหยัดพื้นที่’,
‘นำไปถังโลหะหรือขายรับซื้อ’,
‘อลูมิเนียมรีไซเคิลได้ 100%’
],
‘steel-can’: [
‘ล้างทำความสะอาดภายใน’,
‘ถอดป้ายกระดาษออก’,
‘ใช้แม่เหล็กทดสอบ (เหล็กติดแม่เหล็ก)’,
‘นำไปถังโลหะสีเทา’
],
‘glass-bottle’: [
‘ล้างให้สะอาดและถอดฝา’,
‘แยกตามสี (ใส, เขียว, น้ำตาล)’,
‘ระวังการบิ่นแตก’,
‘นำไปถังแก้วหรือจุดรวบรวม’
],
‘organic-waste’: [
‘นำไปทำปุ่ยหมักในบ้าน’,
‘หมักในครัวเรือน’,
‘ใส่ถังขยะเปียกสีน้ำตาล’,
‘หลีกเลี่ยงการผสมกับขยะแห้ง’
],
‘food-waste’: [
‘แยกออกจากบรรจุภัณฑ์’,
‘หั่นเป็นชิ้นเล็กก่อนหมัก’,
‘ใส่ถังขยะอินทรีย์’,
‘ทำปุ่ยหมักหรือเลี้ยงหนอน’
],
‘electronic’: [
‘อันตราย! นำไปศูนย์รับอุปกรณ์อิเล็กทรอนิกส์’,
‘ลบข้อมูลส่วนตัวออกก่อน’,
‘บริจาคหากยังใช้งานได้’,
‘ห้ามทิ้งขยะทั่วไป - มีสารพิษ’
],
‘battery’: [
‘อันตราย! นำไปจุดรับแบตเตอรี่พิเศษ’,
‘ห้ามทิ้งขยะทั่วไป - ปนเปื้อนดิน’,
‘ติดต่อร้านขายแบตเตอรี่’,
‘ใช้แบตเตอรี่ชาร์จได้แทน’
],
‘medical-waste’: [
‘อันตรายสูง! ต้องการการจัดการพิเศษ’,
‘ติดต่อโรงพยาบาลหรือศูนย์รับจัดการ’,
‘ห้ามทิ้งขยะทั่วไป’,
‘ใส่ถุงพิเศษสีเหลือง’
],
‘fabric’: [
‘บริจาคหากยังใช้งานได้’,
‘นำไปรีไซเคิลที่ศูนย์ผ้า’,
‘ใช้เป็นผ้าเช็ดก่อนทิ้ง’,
‘ทิ้งในถังขยะทั่วไป’
],
‘ceramic’: [
‘ห้ามใส่ถังแก้ว - จะทำลายเครื่องจักร’,
‘ทิ้งในถังขยะทั่วไป’,
‘ระวังชิ้นส่วนแหลมคม’,
‘ห่อด้วยกระดาษก่อนทิ้ง’
],
‘rubber’: [
‘นำไปศูนย์รีไซเคิลยางพิเศษ’,
‘ยางรถยนต์ไปร้านยาง’,
‘ใช้ประโยชน์อื่นก่อนทิ้ง’,
‘ห้ามเผา - ปล่อยควันพิษ’
],
‘foam’: [
‘ทำความสะอาดก่อนทิ้ง’,
‘บีบให้เล็กเพื่อประหยัดพื้นที่’,
‘นำไปจุดรวบรวมโฟมพิเศษ’,
‘หลีกเลี่ยงการใช้โฟมใส่อาหาร’
],
‘mixed-waste’: [
‘ทิ้งตามประเภทขยะที่ถูกต้อง’,
‘แยกขยะก่อนทิ้ง’,
‘ปฏิบัติตามกฎการจัดการขยะ’,
‘ลดการใช้และเพิ่มการรีไซเคิล’
]
};

// Environmental impact information
export const environmentalImpacts = {
‘plastic-bottle’: ‘ใช้เวลา 450 ปีในการย่อยสลาย - การรีไซเคิล 1 ขวดช่วยประหยัดพลังงาน 75% และลดก๊าซเรือนกระจก 1.5 กิโลกรัม’,
‘plastic-bag’: ‘ใช้เวลา 20 ปีในการย่อยสลาย - 1 ล้านถุงพลาสติกถูกใช้ทุกนาที ทั่วโลก ส่งผลกระทบต่อสัตว์ทะเล’,
‘paper’: ‘การรีไซเคิล 1 ตันกระดาษ = ช่วยชีวิตต้นไม้ 17 ต้น ประหยัดน้ำ 26,000 ลิตร และลดมลพิษทางอากาศ 27 กิโลกรัม’,
‘cardboard’: ‘การรีไซเคิลกระดาษลังลดการใช้พลังงาน 25% และประหยัดน้ำ 13% เมื่อเทียบกับการผลิตใหม่’,
‘aluminum-can’: ‘รีไซเคิลได้ 100% ไม่จำกัดจำนวนครั้ง - ประหยัดพลังงาน 95% เมื่อเปรียบเทียบกับการผลิตจากแร่บอกไซต์’,
‘steel-can’: ‘เหล็กรีไซเคิลได้อย่างไม่จำกัด - การรีไซเคิล 1 ตันเหล็กประหยัดพลังงาน 1,400 กิโลวัตต์ชั่วโมง’,
‘glass-bottle’: ‘แก้วรีไซเคิลได้ 100% ไม่เสื่อมคุณภาพ - การรีไซเคิล 1 ขวดแก้วประหยัดพลังงานเพียงพอให้หลอดไฟ 4 วัตต์ติด 4 ชั่วโมง’,
‘organic-waste’: ‘สามารถผลิตก๊าซมีเทนได้หากไม่จัดการถูกต้อง - การหมักช่วยลดก๊าซเรือนกระจกและสร้างปุ่ยธรรมชาติ’,
‘food-waste’: ‘เศษอาหาร 1/3 ของอาหารที่ผลิตทั่วโลกถูกทิ้ง - การลดเศษอาหารช่วยประหยัดน้ำและลดก๊าซเรือนกระจก’,
‘electronic’: ‘ขยะอิเล็กทรอนิกส์เป็นขยะที่เพิ่มขึ้นเร็วที่สุด - มีสารพิษแต่มีโลหะมีค่าที่สามารถรีไซเคิลได้’,
‘battery’: ‘แบตเตอรี่ 1 ก้อนสามารถปนเปื้อนน้ำใต้ดิน 400 ลิตร - การรีไซเคิลช่วยกู้โลหะหายากกลับมาใช้’,
‘medical-waste’: ‘ต้องการการจัดการพิเศษเพื่อป้องกันการแพร่กระจายของเชื้อโรคและสารเคมีอันตราย’,
‘fabric’: ‘อุตสาหกรรมแฟชั่นเป็นอุตสาหกรรมที่ปล่อยมลพิษเป็นอันดับ 2 ของโลก - การบริจาคและรีไซเคิลช่วยลดผลกระทบ’,
‘ceramic’: ‘เซรามิกใช้เวลานานกว่า 1 ล้านปีในการย่อยสลาย - ควรใช้ให้นานที่สุดและระวังไม่ให้ปนเปื้อนในขยะรีไซเคิล’,
‘rubber’: ‘ยางธรรมชาติย่อยสลายได้ แต่ยางสังเคราะห์ใช้เวลา 50-80 ปี - การรีไซเคิลยางสามารถนำมาทำถนนและสนามเด็กเล่น’,
‘foam’: ‘โฟมโพลีสไตรีนใช้เวลา 500+ ปีในการย่อยสลาย - ย่อยยากและปล่อยสารเคมีเมื่อเผาไหม้’,
‘mixed-waste’: ‘การแยกขยะอย่างถูกต้องช่วยเพิ่มประสิทธิภาพการรีไซเคิลและลดผลกระทบต่อสิ่งแวดล้อม’
};

// Get recommendation for a specific category
export const getRecommendations = (category) => {
return recommendations[category] || recommendations[‘mixed-waste’];
};

// Get environmental impact for a specific category
export const getEnvironmentalImpact = (category) => {
return environmentalImpacts[category] || environmentalImpacts[‘mixed-waste’];
};

// Get waste type information
export const getWasteTypeInfo = (type) => {
return wasteTypes[type] || wasteTypes[‘general’];
};

// Get category by type
export const getCategoriesByType = (type) => {
return Object.entries(wasteCategories)
.filter(([_, category]) => category.type === type)
.map(([key, category]) => ({ key, …category }));
};

// Search categories
export const searchCategories = (query) => {
const lowerQuery = query.toLowerCase();
return Object.entries(wasteCategories)
.filter(([key, category]) =>
key.toLowerCase().includes(lowerQuery) ||
category.thai.toLowerCase().includes(lowerQuery) ||
category.english.toLowerCase().includes(lowerQuery)
)
.map(([key, category]) => ({ key, …category }