# aggregate distance, time for different groups

import csv

all_dic = {"ALL": {"count": 0, "dist": 0, "time": 0}}
mode_dic = {}
aff_dic = {}

if __name__ == "__main__":
    ind_reader = csv.reader(open("mit-commuter-data-time.csv"))
    ind_reader.next() # skip header row
    for line in ind_reader:
        count = int(line[0])
        aff = line[1]
        if aff == "SS":
            aff = "AS" # merge support staff into academic staff
        mode = line[3]
        dist = float(line[-2])
        dist_mul_cnt = dist * count
        time = float(line[-1])

        # put in all dic
        all_dic["ALL"]["count"] += count
        all_dic["ALL"]["dist"] += dist_mul_cnt * 2 # multiply by 2 for round trip
        all_dic["ALL"]["time"] += time * 2

        # put in mode dic
        if mode not in mode_dic:
            mode_dic[mode] = {
                    "count": count,
                    "dist": dist_mul_cnt * 2,
                    "time": time * 2,
                    }
        else:
            mode_dic[mode]["count"] += count
            mode_dic[mode]["dist"] += dist_mul_cnt * 2
            mode_dic[mode]["time"] += time * 2

        # put in aff dic
        if aff not in aff_dic:
            aff_dic[aff] = {
                    "count": count,
                    "dist": dist_mul_cnt * 2,
                    "time": time * 2,
                    }
        else:
            aff_dic[aff]["count"] += count
            aff_dic[aff]["dist"] += dist_mul_cnt * 2
            aff_dic[aff]["time"] += time * 2
