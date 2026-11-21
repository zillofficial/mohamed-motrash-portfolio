import adamLogo from './assets/adamtop-client.webp';
import biruniUnionLogo from './assets/biruni-student-union.webp';
import biruniLogo from './assets/biruni-university.webp';
import arabUnionLogo from './assets/biruni-arab-student-union.webp';
import generalUnionLogo from './assets/general-union-syrian-students.webp';
import goldLogo from './assets/gold-client-logo.webp';
import studyFansLogo from './assets/studyfans.webp';
import sawaLogo from './assets/sawa-logo.webp';
export const content = {
 name:'محمد مطراش', role:'مصمم جرافيكي', nav:['الرئيسية','أعمالي','من أنا','عملائي','إنجازاتي'],
 headline:['دع إبداعك','يتـــــــحدّث.'], intro:'أفكارك تستحق أن تُرى.', cta:'أعمالي', eyebrow:'تصميم يصنع الفرق',
 about:['مصمم جرافيكي أمتلك خبرة تمتد إلى خمسة أعوام في مجال التصميم. عملت على مشاريع متنوعة، واكتسبت خبرة تمكّنني من تحويل الأفكار إلى تصاميم مميزة تعكس هوية المشروع وتجذب انتباه الجمهور.','أعتني بالتفاصيل، وأحرص على تقديم أعمال إبداعية متقنة. أؤمن بأن التصميم لا يقتصر على جمال المظهر، بل ينقل رسالتك، ويمنح مشروعك قيمة، ويبرز تميّزه.'],
 lanyardPhoto:`${import.meta.env.BASE_URL}lanyard-portrait.webp`, portrait:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop',
 categories:['مختارات من التصميم والمونتاج'],

 clientRows:[
  [
   {name:'اتحاد الطلاب السوريين في جامعة البيروني',logo:biruniUnionLogo,shape:'paper-logo'},
   {name:'اتحاد الطلبة العرب في جامعة البيروني',logo:arabUnionLogo,shape:'arab-union'},
   {name:'الاتحاد العام لطلبة سوريا',logo:generalUnionLogo,shape:'general-union'},
  ],
  [
   {name:'جامعة البيروني',logo:biruniLogo,shape:'paper-logo'},
   {name:'SAWA',logo:sawaLogo},
   {name:'StudyFans',logo:studyFansLogo,shape:'paper-logo'},
  ],
  [
   {name:'أحمد منصور',logo:goldLogo},
   {name:'AdamTop',logo:adamLogo,shape:'navy-logo'},
  ],
 ],
 stats:[{value:500,label:'عميل'},{value:400,label:'مشروع'},{value:5,label:'سنوات خبرة'}],
 ui:{menu:'فتح القائمة',close:'إغلاق',prev:'السابق',next:'التالي',sample:'نماذج توضيحية قابلة للاستبدال',footer:'كل فكرة، بداية لحكاية بصرية.',made:'صُمّم بشغف',aboutLabel:'أنا',clientSub:'شراكات أعتز بها، وأثر يتجدد.',statSub:'رحلة من الشغف، تُترجم إلى أرقام.',worksHint:'اسحب لاستكشاف الأعمال',pause:'إيقاف الحركة التلقائية',play:'تشغيل الحركة التلقائية'}
};
