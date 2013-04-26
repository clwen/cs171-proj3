# put individual data points to buckets

import csv
import random

bdic = {} # buckets dictionary

if __name__ == "__main__":
    ind_reader = csv.reader(open("confidential.csv"))
    ind_reader.next() # skip header row
    for line in ind_reader:
        fips = line[-2] # FIPS code
        if fips[:2] != '25':
            continue # skip points that are not in Mass. (fips code start by 25)

        mode = line[5]
        if mode == "UNK":
            continue # skip commute type unknown

        aff = line[2] # affiliation
        if aff in ['1', '2', '3', '4']:
            aff = 'U'
        elif aff in ['OTA', 'RES', 'MED']:
            aff = "AS"
        elif aff in ['SER', 'SUP']:
            aff = 'SS'

        area = line[3]
        if area in ['PCC', 'VPC']:
            area = 'CRP'
        elif area in ['OTH', 'WHTKR']:
            area = 'OTH'
        elif area in ['AAA', 'APA', 'CHA', 'DSL', 'DUE', 'DGE', 'EHS', 'MAJ', 'EVP', 'OEVP', 'OPV', 'VPF', 'VPHR', 'VPRD', 'VPRES']:
            area = 'SLD'
        elif area == 'VPIST':
            area = 'IST'

        bkey = fips[:5] + area # bucket key

        lng = line[0]
        lat = line[1]
        dist = line[-1] # distance
        point = [lat, lng, aff, area, mode, fips, dist]

        if bkey not in bdic:
            bdic[bkey] = [point,]
        else:
            bdic[bkey].append(point)

    bu_writer = csv.writer(open("area_buckets.csv", 'w')) # bucket writer
    bu_writer.writerow(["Latitude", "Longitude", "Area", "FIPS", "Distance"])
    for k, points in bdic.iteritems():
        step = 5
        for i in range(len(points) / step):
            tps = points[i*step:i*step+5]
            ri = random.randint(0, 4) # random index
            lat = tps[ri][0]
            lng = tps[ri][1]
            # aff = tps[ri][2]
            area = tps[ri][3]
            fips = tps[ri][-2]
            dist = tps[ri][-1]
            bucket = [lat, lng, area, fips, dist]
            print bucket
            bu_writer.writerow(bucket)
