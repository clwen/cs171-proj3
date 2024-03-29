import time
import sys
import urllib
import json
import time

MIN_LAT=42.005594
MAX_LAT=42.6851936
MIN_LON=-71.4328231
MAX_LON=-70.725800

MAX_RENT=6050

DEFAULTS = {
    'cities': 'false',
    'showPOI': 'false',
    'limit': 2000,
    'minRent': 0,
    'maxRent': 6000,
    'searchTerms': '',
    'maxPricePerBedroom': 6000,
    'minBR': 0,
    'maxBR': 10,
    'minBA': 1,
    'maxAge': 7,
    'imagesOnly': 'false',
    'phoneReq': 'false',
    'cats': 'false',
    'dogs': 'false',
    'noFee': 'false',
    'showSubs': 'true',
    'showNonSubs': 'true',
    'showRooms': 'true',
    'userId': -1,
    'cl': 'true',
    'apts': 'true',
    'ood': 'true',
    'zoom': 15,
    'favsOnly': 'false',
    'onlyHQ': 'true',
    'showHidden': 'false',
    'workplaceLat': 0,
    'workplaceLong': 0,
    'maxTime': 0
    }

def query(kwargs):
    assert 'eastLong' in kwargs
    assert 'northLat' in kwargs
    assert 'westLong' in kwargs
    assert 'southLat' in kwargs

    url='https://www.padmapper.com/reloadMarkersJSON.php'

    full_url = '%s?%s' % (url, '&'.join('%s=%s' % (k,v) for (k,v) in kwargs.items()))

    apts = []

    txt = ""
    try:
        txt = urllib.urlopen(full_url).read()
        j = json.loads(txt)
    except Exception, e:
        print "ERROR", e
        print "ERROR", txt
        print "ERROR", full_url
        return []

    for apartment in j:
        apts.append(( apartment['id'], apartment['lng'], apartment['lat'] ))

    assert len(apts) < kwargs['limit']-1

    return apts

def start():
    kwargs = dict((k,v) for (k,v) in DEFAULTS.items())
    kwargs['southLat']=MIN_LAT
    kwargs['westLong']=MIN_LON
    kwargs['northLat']=MAX_LAT
    kwargs['eastLong']=MAX_LON

    seen_ids = set()

    epoch_timestamp = int(time.mktime(time.gmtime()))
    with open("apts-%s.txt" % epoch_timestamp, 'w') as outf:
        for rent in range(100,MAX_RENT,25):
            print "querying from $%s ..." % rent
            for bedrooms in range(10):
                kwargs['minRent'] = rent-25
                kwargs['maxRent'] = rent
                kwargs['minBR'] = bedrooms
                kwargs['maxBR'] = bedrooms

                for apt_id, lon, lat in query(kwargs):
                    if apt_id not in seen_ids:
                        outf.write("%s %s %s %s %s\n" % (
                                rent, bedrooms, apt_id, lon, lat))
                        sys.stdout.flush()
                        seen_ids.add(apt_id)

                time.sleep(2)


if __name__=="__main__":
    start(*sys.argv[1:])
