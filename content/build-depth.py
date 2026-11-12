"""Compile authored six-part lesson expansions, retaining stable lesson IDs."""
from pathlib import Path
import json
P=Path(__file__).resolve().parents[1]
s=json.loads((P/'dist/data.js').read_text().split(';\nconst studyMeta=')[0].removeprefix('const services='))
entries={}
for path in sorted((P/'content').glob('depth-[0-9]*.txt')):
 for line,row in enumerate(path.read_text().splitlines(),1):
  fields=row.split('|');assert len(fields)==6,(path,line,len(fields))
  id_,flow,analogy,boundary,cases,choices=fields;id_=int(id_)
  assert id_ not in entries
  alternatives=[]
  for c in choices.split(';'):
   option,difference,relation=c.split('^');alternatives.append(dict(option=option,difference=difference,relation=relation))
  entries[id_]=dict(mechanics=flow.split(';'),analogy=analogy,analogyBoundary=boundary,useCases=cases.split(';'),alternatives=alternatives)
for row in (P/'content/depth-use.txt').read_text().splitlines():
 id_,use=row.split('|');entries[int(id_)]['use']=use
assert set(entries)=={x['id'] for x in s},'Every lesson must have its own expansion'
for id_,entry in entries.items():
 assert len(entry['mechanics'])==3,(id_,'3 steps needed')
 assert len(entry['useCases'])>=2,(id_,'cases')
 assert len(entry['alternatives'])>=2,(id_,'alternatives')
 for field in ['analogy','analogyBoundary']:assert len(entry[field])>35,(id_,field)
(P/'dist/depth.js').write_text('const lessonDepth='+json.dumps(entries,ensure_ascii=False)+';\nfor(const lesson of services)Object.assign(lesson,lessonDepth[lesson.id]);\n')
print('Compiled six-part content for',len(entries),'lessons')
