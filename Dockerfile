FROM postgres:latest

RUN apt-get update && apt-get clean language-pack-ja && apt-get install -y locales \
    && rm -rf /var/lib/apt/lists/* && localedef -f UTF-8 -i ja_JP ja_JP.UTF-8 

ENV TZ Azia/Tokyo\
    LANG=ja_JP.UTF-8 \
    LANGUAGE=ja_JP:ja \
    LC_ALL=ja_JP.UTF-8