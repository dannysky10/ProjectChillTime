from flask import Flask, url_for, redirect
from flask import render_template
from flask import request
import os
from flask import json
from flask import jsonify
from flask import Response
import urllib2
import sqlite3 as sql
from flask import g
from cgi import parse_qs, escape

import tmdbsimple as tmdb
tmdb.API_KEY = '30dae1d722bd468f31399114d91007bc'


GenreList = {'Comedy': 35, 
'Action': 28, 
'Thriller': 53, 
'Science Fiction': 878,
'Drama':18,
'Animation':16,
'Family':10751}



app = Flask(__name__)




@app.route('/')
@app.route('/index/')
def index():
    user = {'nickname': 'Dominic'}
    return render_template('index.html',title='ChillTime',user = user)



@app.route("/findTitle/<string:data>", methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'])
def echo_title(data):
    if request.method == 'GET':
        movies = search_title(data)
        return jsonify({"data": movies})


@app.route("/findGenre/<int:page>/<string:data>", methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'])
def echo_genre(page, data):
    if request.method == 'GET':
        movies = search_genre(page, data)
        return jsonify({"data": movies})
     


def search_genre(page, data):
    movieList = []
    genre = tmdb.Genres(id=GenreList[data])
    movies = genre.movies(page= page+1)
    for s in movies["results"]:
        movieList.append(s)
        
    return movieList



def search_title(data):
    search = tmdb.Search()
    response = search.movie(query= data)
    movieList = []
    totalPages = 2

    for s in search.results:
        movieList.append(s)

        
    return movieList


with app.test_request_context():
    print url_for('static', filename='style.css')
    print url_for('static', filename='cover.css')
    print url_for('index')



if __name__ == '__main__':
    app.debug = True
    app.run()