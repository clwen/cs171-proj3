# group confidential data according to distance
# for the usage of stacked area chart

import csv

# distance dic
# e.g., {1: {"WLK": 30, "BIC": 20, "DRV": 2}
ddic = {}

if __name__ == "__main__":
    conf_reader = csv.reader(open("confidential.csv")) # confidential reader
    conf_reader.next() # skip header row
    for line in conf_reader:
        dist = int(float(line[-1]))
        if dist > 104:
            continue # skip data points 
        # bin the range [80, 104] in 5
        if dist >= 80 and dist < 85:
            dist = 80
        elif dist >= 85 and dist < 90:
            dist = 85
        elif dist >= 90 and dist < 95:
            dist = 90
        elif dist >= 95 and dist < 100:
            dist = 95
        elif dist >= 100 and dist < 105:
            dist = 100

        mode = line[5]
        if mode in ["UNK", "TAX", "HOM", "VAN"]:
            continue # skip commute type unknown, other, shuttle
        # WLK -> WLK
        # BIC -> BIC
        elif mode in ["BIC_PUB", "BIC_DRV_PUB", "DRV_PUB", "WLK_PUB", "CRP_PUB"]:
            mode = "T"
        elif mode in ["CRP2", "CRP6", "DRP"]:
            mode = "CARPOOL"
        elif mode in ["BIC_DRV", "DRV", "DRV_HOM"]:
            mode = "DRV"
        
        if dist not in ddic:
            ddic[dist] = {mode: 1}
        else: # already in ddic
            if mode not in ddic[dist]:
                ddic[dist][mode] = 1
            else:
                ddic[dist][mode] += 1

    # for d, items in ddic.iteritems():
    #     print d, items

    grp_writer = csv.writer(open("dist_grouped.csv", 'w'))
    modes = ["WLK", "BIC", "T", "DRV", "CARPOOL"]
    grp_writer.writerow(["Distance"] + modes + ["Total"]) # write header row
    for d in range(81) + [85, 90, 95, 100]:
        counts = []
        total = 0
        for mode in modes:
            try:
                count = ddic[d][mode]
            except:
                count = 0
            total += count
            counts.append(count)
        pers = [] # percentages
        for count in counts:
            pers.append(float(count) / float(total))
        row = [d] + pers + [total]
        print row
        grp_writer.writerow(row)
