# add a column to data that indicates the time spent on commute

import csv

WLK_SPEED = 0.0833
BIC_SPEED = 0.4
T_SPEED = 0.5333
DRV_SPEED = 0.6666
CARPOOL_SPEED = 0.4693
SHT_SPEED = 0.4693

if __name__ == "__main__":
    dis_reader = csv.reader(open("mit-commuter-data.csv"))
    dis_reader.next() # skip header row
    tim_writer = csv.writer(open("mit-commuter-data-time", 'w'))
    tim_writer.writerow(["Count", "Affiliation", "Area", "Commute Type", "County", "Distance", "Time"]) # write header row
    for line in dis_reader:
        count = float(line[0])
        aff = line[1]
        area = line[2]
        mode = line[3]
        fips = line[4]
        dist = float(line[5])
        
        if mode == "UNK" or mode == "OTH":
            continue # skip unknown, other type
        elif mode == "WLK":
            time = dist / WLK_SPEED * count
        elif mode == "BIC":
            time = dist / BIC_SPEED * count
        elif mode.endswith("_T"):
            mode = "T"
            time = dist / T_SPEED * count
        elif mode == "DRV":
            time = dist / DRV_SPEED * count
        elif mode == "CARPOOL":
            time = dist / CARPOOL_SPEED * count
        elif mode == "SHT":
            time = dist / SHT_SPEED * count
        else:
            print "WTH is %s" % mode

        row = [int(count), aff, area, mode, fips, dist, time]
        print row
        tim_writer.writerow(row)

