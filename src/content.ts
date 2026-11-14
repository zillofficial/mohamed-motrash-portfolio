import adamLogo from './assets/adamtop-light-logo.webp';
import sawaLogo from './assets/sawa-logo.webp';
export const content = {
 name:'محمد مطراش', role:'مصمم جرافيك', nav:['الرئيسية','أعمالي','من أنا','عملائي','إنجازاتي'],
 headline:['خلّ إبداعك','يتـــــــكلم.'], intro:'أفكارك تستحق أن تُرى.', cta:'أعمالي', eyebrow:'تصميم يصنع الفرق',
 about:['مصمم جرافيك بخبرة أكثر من 10 سنوات في مجال التصميم. اشتغلت على مشاريع متنوعة، واكتسبت خبرة تساعدني أحوّل أي فكرة لتصميم مميز يعكس هوية المشروع ويشد انتباه الجمهور.','اهتم بالتفاصيل وأحب أطلع بشغل إبداعي ومرتب، والأهم عندي إن التصميم مو بس يكون شكله حلو، بل يوصل رسالتك ويعطي مشروعك قيمة ويميزه عن غيره.'],
 lanyardPhoto:`${import.meta.env.BASE_URL}lanyard-portrait.png`, portrait:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop',
 categories:['مختارات من التصميم والمونتاج'],

 clients:[{name:'AdamTop',logo:adamLogo},{name:'SAWA',logo:sawaLogo}],
 stats:[{value:1000,label:'عميل'},{value:800,label:'مشروع'},{value:10,label:'سنوات خبرة'}],
 ui:{menu:'فتح القائمة',close:'إغلاق',prev:'السابق',next:'التالي',sample:'نماذج توضيحية قابلة للاستبدال',footer:'كل فكرة، بداية لحكاية بصرية.',made:'صُمّم بشغف',aboutLabel:'أنا',clientSub:'شراكات أعتز بها، وأثر يتجدد.',statSub:'رحلة من الشغف، تُترجم إلى أرقام.',worksHint:'اسحب لاستكشاف الأعمال',pause:'إيقاف الحركة التلقائية',play:'تشغيل الحركة التلقائية'}
};
