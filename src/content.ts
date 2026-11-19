import adamLogo from './assets/adamtop-light-logo.webp';
import sawaLogo from './assets/sawa-logo.webp';
export const content = {
 name:'محمد مطراش', role:'مصمم جرافيكي', nav:['الرئيسية','أعمالي','من أنا','عملائي','إنجازاتي'],
 headline:['دع إبداعك','يتـــــــحدّث.'], intro:'أفكارك تستحق أن تُرى.', cta:'أعمالي', eyebrow:'تصميم يصنع الفرق',
 about:['مصمم جرافيكي أمتلك خبرة تزيد على عشرة أعوام في مجال التصميم. عملت على مشاريع متنوعة، واكتسبت خبرة تمكّنني من تحويل الأفكار إلى تصاميم مميزة تعكس هوية المشروع وتجذب انتباه الجمهور.','أعتني بالتفاصيل، وأحرص على تقديم أعمال إبداعية متقنة. أؤمن بأن التصميم لا يقتصر على جمال المظهر، بل ينقل رسالتك، ويمنح مشروعك قيمة، ويبرز تميّزه.'],
 lanyardPhoto:`${import.meta.env.BASE_URL}lanyard-portrait.webp`, portrait:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop',
 categories:['مختارات من التصميم والمونتاج'],

 clients:[{name:'AdamTop',logo:adamLogo},{name:'SAWA',logo:sawaLogo}],
 stats:[{value:1000,label:'عميل'},{value:800,label:'مشروع'},{value:10,label:'سنوات خبرة'}],
 ui:{menu:'فتح القائمة',close:'إغلاق',prev:'السابق',next:'التالي',sample:'نماذج توضيحية قابلة للاستبدال',footer:'كل فكرة، بداية لحكاية بصرية.',made:'صُمّم بشغف',aboutLabel:'أنا',clientSub:'شراكات أعتز بها، وأثر يتجدد.',statSub:'رحلة من الشغف، تُترجم إلى أرقام.',worksHint:'اسحب لاستكشاف الأعمال',pause:'إيقاف الحركة التلقائية',play:'تشغيل الحركة التلقائية'}
};
