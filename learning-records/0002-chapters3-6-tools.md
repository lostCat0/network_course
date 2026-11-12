# 计算机网络第3~6章课程生成（含 Wireshark/Packet Tracer 实践）

日期：2026-11-12

## 产出

- `networks/lessons/003-net-ch3-datalink.html`：数据链路层（CRC 例题、CSMA/CD、以太网帧对照真实抓包、3 个实验：Wireshark ARP 分析×2 + Packet Tracer Hub/Switch/VLAN）
- `networks/lessons/004-net-ch4-network.html`：网络层（CIDR 三板斧、ARP 揭秘跨网段问网关、tracert 原理、3 个实验含三路由器静态路由组网）
- `networks/lessons/005-net-ch5-transport.html`：运输层（三次握手/四次挥手含新考法、滑动窗口/SACK、拥塞控制 cwnd 例题、Wireshark 抓握手 + PT 仿真）
- `networks/lessons/006-net-ch6-application.html`：应用层收官（DNS/HTTP/DHCP、Packet Tracer 自建 DNS+Web+DHCP 迷你互联网、六层知识地图）
- `networks/assets/captures/sample-mixed.pcapng`：用 tshark 在用户 WLAN 网卡真实抓取的流量样本，供 Wireshark GUI 打开分析
- 术语表补齐第3~6章；计网首页加 4 张课程卡；第2章页面加「第3章→」导航

## 真实抓包发现（教学素材）

- ICMP ping：本机 10.134.46.202 (MAC b8:1e:a4:ba:cb:0b) → 网关 74:08:aa:99:5c:16，TTL 128/46
- ARP 请求广播 ff:ff:ff:ff:ff:ff、目标 MAC 占位 00:00:00:00:00:00；应答单播
- 网关 10.134.46.1 与 10.134.46.253 应答同一 MAC（VRRP 冗余证据）——已写进第3章教学彩蛋
- 真实流量中出现 SACK（SLE=1 SRE=2）——已用作第5章选择确认的实证

## 环境确认

- Wireshark 4.6.9 @ D:\WireShark（npcap 正常，tshark 可用，WLAN = 接口 5）
- Cisco Packet Tracer 9.0.1 @ D:\Cisco Packet Tracer 9.0.1

## 下一步

- 用户完成各章实验后回收发现/截图；可出模拟卷/专项练习
- 数据库课程可做考前冲刺模拟卷
