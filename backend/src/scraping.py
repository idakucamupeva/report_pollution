#!/usr/bin/env python3

from googlesearch import search
import sys
import re
import requests
from urllib.parse import urlsplit
from collections import deque
from bs4 import BeautifulSoup
import pandas as pd


def scrapSite(url):
    #url = "http://alas.matf.bg.ac.rs/~mi17247/"
    unscraped = deque([url])  

    scraped = set()  

    emails = set()  

    while len(unscraped):
        url = unscraped.popleft()  
        scraped.add(url)

        parts = urlsplit(url)
            
        base_url = "{0.scheme}://{0.netloc}".format(parts)
        if '/' in parts.path:
            path = url[:url.rfind('/')+1]
        else:
             path = url

        #print("Crawling URL %s" % url)
        try:
            response = requests.get(url)
        except (requests.exceptions.MissingSchema, requests.exceptions.ConnectionError):
            continue

        new_emails = set(re.findall(r"[a-z0-9\.\-+]+@[a-z0-9\.\-+]+\.[A-Za-z]*", response.text, re.I))
        emails.update(new_emails) 

        soup = BeautifulSoup(response.text, 'lxml')

        for anchor in soup.find_all("a"):
            if "href" in anchor.attrs:
                link = anchor.attrs["href"]
            else:
                link = ''

                if link.startswith('/'):
                    link = base_url + link
                
                elif not link.startswith('http'):
                    link = path + link

                if not link.endswith(".gz"):
                    if not link in unscraped and not link in scraped:
                        unscraped.append(link)

    #df = pd.DataFrame(emails, columns=["Email"]).

    #emails.add("info@ekologija.gov.rs");
    #print(df["Email"][0])
    vector_emails = []
    for e in emails:
        #print(e)
        vector_emails.append(e)
        
    vector_emails.append("info@ekologija.gov.rs")
    
    for e in vector_emails:
        print(e)
        
        
def googleSearch(args):
    searchResult = search(args, num_results=1)
    scrapSite(searchResult[0])
    #scrapSite(searchResult[1])


if __name__ == "__main__":
    if len(sys.argv) == 1:
        print("Nema argumenata!")
        exit()

    argv = sys.argv
    argv = argv[1:]
    string = ""
    for arg in argv:
        string += arg
        string += " "

    googleSearch(string) 




# zagadjenje grad







