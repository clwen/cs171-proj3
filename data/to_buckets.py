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
        if mode in ["UNK", "TAX", "HOM"]:
            continue # skip commute type unknown
        # WLK -> WLK
        # BIC -> BIC
        elif mode in ["BIC_PUB", "BIC_DRV_PUB", "DRV_PUB", "WLK_PUB", "CRP_PUB"]:
            mode = "T"
        elif mode == "VAN":
            mode = "SHT"
        elif mode in ["CRP2", "CRP6", "DRP"]:
            mode = "CARPOOL"
        elif mode in ["BIC_DRV", "DRV", "DRV_HOM"]:
            mode = "DRV"

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

        bkey = fips[:5] + mode # bucket key

        lng = line[0]
        lat = line[1]
        dist = line[-1] # distance
        point = [lat, lng, aff, area, mode, fips, dist]

        if bkey not in bdic:
            bdic[bkey] = [point,]
        else:
            bdic[bkey].append(point)

    bu_writer = csv.writer(open("mode_buckets.csv", 'w')) # bucket writer
    bu_writer.writerow(["Latitude", "Longitude", "Mode", "FIPS", "Distance"])
    for k, points in bdic.iteritems():
        step = 5
        for i in range(len(points) / step):
            tps = points[i*step:i*step+5] # temp point set
            ri = random.randint(0, 4) # random index
            lat = tps[ri][0]
            lng = tps[ri][1]
            # aff = tps[ri][2]
            # area = tps[ri][3]
            mode = tps[ri][4]
            fips = tps[ri][-2]
            dist = tps[ri][-1]
            bucket = [lat, lng, mode, fips, dist]
            print bucket
            bu_writer.writerow(bucket)
