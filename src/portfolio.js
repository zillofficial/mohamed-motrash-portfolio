const asset=name=>`${import.meta.env.BASE_URL}portfolio/${name}`;
const image=(id,title,description,aspect=1)=>({id,title,description,aspect,type:'image',color:'#1b1b1b',thumb:asset(`${id}-thumb.webp`),full:asset(`${id}-full.webp`)});
const video=(id,title,description,duration,aspect)=>({id,title,description,duration,aspect,type:'video',color:'#1b1b1b',thumb:asset(`${id}-thumb.webp`),video:asset(`${id}.mp4`),duration});
export const portfolio=[
 image('editorial-opinion','تصميم اقتباس — أحمد منصور','تصميم تحريري عربي يجمع الاقتباس والصورة الشخصية والتسلسل البصري.'),
 video('world-cup','كأس العالم — ثلاث دول','مونتاج رياضي قصير يجمع اللقطات والحركة والإيقاع البصري.',36,9/16),
 image('studyfans','StudyFans — لقاء تعريفي','تصميم ترويجي للقاء تعليمي، بتسلسل بصري واضح وتباين قوي.'),
 video('cvc','CVC — فيديو تعريفي','مقتطف من أول دقيقة، يعرض المونتاج والإيقاع البصري لفيديو تعريفي.',60,16/9),
 {...video('interview-promo','أحمد منصور — برومو','مقتطف من أول دقيقة، يجمع المونتاج والكتابة المتحركة والهوية البصرية.',60,16/9),thumb:asset('ahmed-mansour-thumb.webp')},
 video('london-event','فعالية لندن — مونتاج','تغطية فعالية تجمع كلمات المشاركين ولقطات الحدث والمونتاج الإعلاني.',175,16/9),
 image('editorial-thumbnail','صورة مصغّرة لحوار','تصميم صورة مصغّرة لحلقة حوارية، بدمج الصور وإبراز العنوان.',16/9)
];
