# -*- coding: utf-8 -*-
"""Build first-view font subsets from content, retaining shaping and font metrics.
Requires fonttools[woff] (see PERFORMANCE.md). Full fonts remain for other scenes.
"""
from pathlib import Path
import re
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
source=Path('src/content.ts').read_text()
texts=[]
for key in ['name','role','cta','eyebrow']:
 texts.append(re.search(r"\b"+key+r":'([^']*)'",source)[1])
for key in ['nav','headline']:
 texts.extend(re.findall(r"'([^']*)'",re.search(r'\b'+key+r':\[([^\]]+)\]',source)[1]))
text=' '.join(texts)
for name,src in [('cairo','cairo-arabic-400-900.woff2'),('ibm-400','ibm-plex-arabic-arabic-400.woff2'),('ibm-600','ibm-plex-arabic-arabic-600.woff2')]:
 f=TTFont('artwork/fonts/Cairo-variable.ttf',recalcTimestamp=False) if name=='cairo' else TTFont(Path('src/assets/fonts')/src,recalcTimestamp=False)
 if name=='cairo':instantiateVariableFont(f,{'slnt':0},inplace=True)
 opt=subset.Options();opt.flavor='woff2';opt.layout_features=['*'];sub=subset.Subsetter(options=opt);sub.populate(text=text);sub.subset(f);f.flavor='woff2';f.save(Path('src/assets/fonts')/('hero-'+name+'.woff2'))
 print(name,len(f.getBestCmap()))
