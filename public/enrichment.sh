#!/usr/bin/env bash

rails_root=`rails runner "puts Rails.root"`
cd $rails_root/public

java -classpath pantherws/httpclient-4.5.5.jar:pantherws/commons-io-2.6.jar:pantherws/httpcore-4.4.9.jar:pantherws/httpmime-4.5.5.jar:.:pantherws/commons-logging-1.2.jar enrichment.Enrichment "$1"
