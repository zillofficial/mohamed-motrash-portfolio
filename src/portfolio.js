const asset=name=>`${import.meta.env.BASE_URL}portfolio/${name}`;
const customCovers={'international-day':'international-day-cover-v2.webp','freedom-echo':'freedom-echo-cover-v2.webp','world-cup':'world-cup-cover.webp',cvc:'cvc-cover.webp','london-event':'london-event-cover-v2.webp'};
const image=(id,title,description,aspect=1)=>({id,title,description,aspect,type:'image',color:'#1b1b1b',thumb:asset(`${id}-thumb.webp`),full:asset(`${id}-full.webp`)});
const video=(id,title,description,duration,aspect)=>({id,title,description,duration,aspect,type:'video',color:'#1b1b1b',thumb:asset(customCovers[id]||`${id}-thumb.webp`),video:asset(`${id}.mp4`),duration});
export const portfolio=[
 image('qatar-vip','SAWA — استقبال VIP لقطر','تصميم سوشيال ميديا لخدمات السفر والاستقبال، بدمج الصور والتكوين الإعلاني.',4/5),
 image('arab-personality-awards','حفل الشخصية العربية — لندن','تصميم إعلاني رأسي لحفل الشخصية العربية في لندن.',9/16),
 image('liberation-anniversary','عام على التحرير','تصميم فعالية بدمج الصور والخط العربي والتكوين البصري.',4/5),
 video('international-day','اليوم الدولي — جامعة البيروني','فيديو قصير للترويج لليوم الدولي والركن السوري بجامعة البيروني.',22,9/16),
 video('freedom-echo','صدى الحرية — إعلان فعالية','مونتاج رأسي بأسلوب قصصي للترويج لفعالية صدى الحرية.',43,9/16),
 image('editorial-opinion','تصميم اقتباس — أحمد منصور','تصميم تحريري عربي يجمع الاقتباس والصورة الشخصية والتسلسل البصري.'),
 video('world-cup','كأس العالم — ثلاث دول','مونتاج رياضي قصير يجمع اللقطات والحركة والإيقاع البصري.',36,9/16),
 image('studyfans','StudyFans — لقاء تعريفي','تصميم ترويجي للقاء تعليمي، بتسلسل بصري واضح وتباين قوي.'),
 video('cvc','CVC — فيديو تعريفي','مقتطف من أول دقيقة، يعرض المونتاج والإيقاع البصري لفيديو تعريفي.',60,16/9),
 {...video('interview-promo','أحمد منصور — برومو','مقتطف من أول دقيقة، يجمع المونتاج والكتابة المتحركة والهوية البصرية.',60,16/9),thumb:asset('ahmed-mansour-cover.webp')},
 video('london-event','فعالية لندن — مونتاج','تغطية فعالية تجمع كلمات المشاركين ولقطات الحدث والمونتاج الإعلاني.',175,16/9),
 image('editorial-thumbnail','صورة مصغّرة لحوار','تصميم صورة مصغّرة لحلقة حوارية، بدمج الصور وإبراز العنوان.',16/9)
];
