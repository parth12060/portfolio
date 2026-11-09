import urllib.request, urllib.parse, urllib.error, json, concurrent.futures, argparse
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
args=argparse.ArgumentParser(description='Check portfolio routes, metadata, links, and assets.')
args.add_argument('--base',default='http://127.0.0.1:3001')
args.add_argument('--output',default='/tmp/portfolio-seo-audit.json')
args=args.parse_args()
BASE=args.base.rstrip('/')
class Page(HTMLParser):
 def __init__(self):
  super().__init__(); self.title=''; self.in_title=False; self.h1=0; self.meta={}; self.canonical=[]; self.links=[]; self.assets=[]; self.ids=[]; self.images=[]; self.schemas=[]; self.in_schema=False; self.schema=''
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='title':self.in_title=True
  if t=='h1':self.h1+=1
  if 'id' in d:self.ids.append(d['id'])
  if t=='meta':self.meta[d.get('name',d.get('property',''))]=d.get('content','')
  if t=='link' and d.get('rel')=='canonical':self.canonical.append(d.get('href'))
  if t=='a' and d.get('href'):self.links.append(d['href'])
  if t=='img':self.images.append(d);self.assets.append(d.get('src',''))
  if t=='script' and d.get('type')=='application/ld+json':self.in_schema=True;self.schema=''
 def handle_endtag(self,t):
  if t=='title':self.in_title=False
  if t=='script' and self.in_schema:self.schemas.append(json.loads(self.schema));self.in_schema=False
 def handle_data(self,s):
  if self.in_title:self.title+=s
  if self.in_schema:self.schema+=s
with urllib.request.urlopen(BASE+'/sitemap.xml',timeout=30) as response:
 paths=[urllib.parse.urlparse(e.text).path or '/' for e in ET.fromstring(response.read()).iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
pages={}; report={'pages':{},'badLinks':[],'badAssets':[],'brokenAnchors':[],'externalLinks':[]}
def fetch(url):
 try:
  with urllib.request.urlopen(url,timeout=30) as r:return r.status,r.headers,r.read()
 except urllib.error.HTTPError as e:return e.code,e.headers,e.read()
for path in paths:
 status,headers,body=fetch(BASE+path); p=Page();p.feed(body.decode());pages[path]=p
 report['pages'][path]={'status':status,'title':p.title,'h1':p.h1,'description':p.meta.get('description'),'canonical':p.canonical,'ogTitle':p.meta.get('og:title'),'ogImage':p.meta.get('og:image'),'robots':p.meta.get('robots'),'schemaTypes':[x.get('@type') for x in p.schemas],'missingAlt':sum('alt' not in i for i in p.images),'duplicateIds':len(p.ids)-len(set(p.ids)),'htmlBytes':len(body)}
links=set(); assets=set();external=set()
for path,p in pages.items():
 for link in p.links:
  u=urllib.parse.urlparse(urllib.parse.urljoin(BASE+path,link))
  if u.netloc==urllib.parse.urlparse(BASE).netloc:
   links.add(u.path)
   if u.fragment and u.path in pages and urllib.parse.unquote(u.fragment) not in pages[u.path].ids:report['brokenAnchors'].append([path,link])
  elif u.scheme in ('http','https'):external.add(link)
 for asset in p.assets:
  if asset.startswith('/'):assets.add(asset)
for page in pages.values():
 if page.meta.get('og:image'):
  assets.add(urllib.parse.urlparse(page.meta['og:image']).path)
assets.add('/icon.svg')
for kind,urls in [('badLinks',links),('badAssets',assets)]:
 def test(path):
  status,_,_=fetch(BASE+path);return path,status
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
  for path,status in pool.map(test,urls):
   if status!=200:report[kind].append([path,status])
report['internalPathsChecked']=len(links);report['assetsChecked']=len(assets);report['externalLinks']=sorted(external)
for path in ['/robots.txt','/sitemap.xml','/missing-audit-page','/blog/missing-audit-post','/favicon.ico']:
 status,headers,body=fetch(BASE+path)
 report[path]={'status':status,'contentType':headers.get('Content-Type'),'noindex':b'noindex' in body}
Path(args.output).write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
failures=bool(report['badLinks'] or report['badAssets'] or report['brokenAnchors'])
for page in report['pages'].values():
 failures |= page['status'] != 200 or page['h1'] != 1 or len(page['canonical']) != 1 or not page['description'] or not page['ogImage'] or page['missingAlt'] > 0 or page['duplicateIds'] > 0
failures |= len({page['title'] for page in report['pages'].values()}) != len(pages)
failures |= any(report[path]['status'] != 200 for path in ['/robots.txt','/sitemap.xml','/favicon.ico'])
for path in ['/missing-audit-page','/blog/missing-audit-post']:
 failures |= report[path]['status'] != 404 or not report[path]['noindex']
raise SystemExit(1 if failures else 0)
