tls (安全传输层)

tls 模块是对安全传输层（TLS）及安全套接层（SSL）协议的实现，建立在OpenSSL的基础上。 

TLS/SSL是public/private key infrastructure (PKI).大部分情况下，每个服务器和客户端都应该有一个私钥。而私钥有多种生成方式。



步骤：都是通过openssl生成。
	  1  私钥生成。  
	  1.1 生成私钥CSR文件（证书申请文件）＋   
	  2. ＋ （私钥或ca签名 生成的方式）的 自签名证书。 ＋ 
	  3. ＋ 2又能生成 .pfx 或者 .p12文件。

	  openssl genrsa -out ryans-key.pem 2048  

	  openssl req -new -sha256 -key ryans-key.pem -out ryans-csr.pem

	  openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem

	  openssl pkcs12 -export -in ryans-cert.pem -inkey ryans-key.pem \
      -certfile ca-cert.pem -out ryans.pfx

入參：
        in: 被签名的证书
		inkey: 有关的私钥
		certfile: 签入文件的证书串，比如： cat ca1-cert.pem ca2-cert.pem > ca-cert.pem