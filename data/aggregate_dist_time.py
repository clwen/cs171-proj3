# aggregate distance, time for different groups

import csv
import json

all_dic = {"ALL": {"count": 0, "dist": 0, "time": 0}}

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
        if mode not in all_dic:
            all_dic[mode] = {
                    "count": count,
                    "dist": dist_mul_cnt * 2,
                    "time": time * 2,
                    }
        else:
            all_dic[mode]["count"] += count
            all_dic[mode]["dist"] += dist_mul_cnt * 2
            all_dic[mode]["time"] += time * 2

        # put in aff dic
        if aff not in all_dic:
            all_dic[aff] = {
                    "count": count,
                    "dist": dist_mul_cnt * 2,
                    "time": time * 2,
                    }
        else:
            all_dic[aff]["count"] += count
            all_dic[aff]["dist"] += dist_mul_cnt * 2
            all_dic[aff]["time"] += time * 2

    print json.dumps(all_dic)
