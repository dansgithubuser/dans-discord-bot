#! /usr/bin/env python3

#===== imports =====#
import argparse
import copy
import datetime
import os
import re
import subprocess
import sys

#===== args =====#
parser = argparse.ArgumentParser()
parser.add_argument('-r', '--run', action='store_true')
parser.add_argument('-t', '--test', metavar='channel ID')
parser.add_argument('--docker-build', '--dkrb', action='store_true')
parser.add_argument('--docker-run', '--dkrr', action='store_true')
parser.add_argument('-o', '--origin', default='http://localhost:8000')
args = parser.parse_args()

#===== consts =====#
DIR = os.path.dirname(os.path.realpath(__file__))

#===== setup =====#
os.chdir(DIR)

#===== helpers =====#
def blue(text):
    return '\x1b[34m' + text + '\x1b[0m'

def timestamp():
    return '{:%Y-%m-%d %H:%M:%S.%f}'.format(datetime.datetime.now())

def invoke(
    *args,
    popen=False,
    no_split=False,
    out=False,
    quiet=False,
    **kwargs,
):
    if len(args) == 1 and not no_split:
        args = args[0].split()
    if not quiet:
        print(blue('-'*40))
        print(timestamp())
        print(os.getcwd()+'$', end=' ')
        if any([re.search(r'\s', i) for i in args]):
            print()
            for i in args: print(f'\t{i} \\')
        else:
            for i, v in enumerate(args):
                if i != len(args)-1:
                    end = ' '
                else:
                    end = ';\n'
                print(v, end=end)
        if kwargs: print(kwargs)
        if popen: print('popen')
        print()
    if kwargs.get('env') != None:
        env = copy.copy(os.environ)
        env.update(kwargs['env'])
        kwargs['env'] = env
    if popen:
        return subprocess.Popen(args, **kwargs)
    else:
        if 'check' not in kwargs: kwargs['check'] = True
        if out: kwargs['capture_output'] = True
        result = subprocess.run(args, **kwargs)
        if out:
            result = result.stdout.decode('utf-8').strip()
        return result

#===== main =====#
if len(sys.argv) == 1:
    parser.print_help()
    sys.exit()

if args.run:
    invoke('npm run start')

if args.test:
    import requests
    res = requests.post(f'{args.origin}/channel/{args.test}/message', json={
        'message': 'Hello, again.',
    })
    print(f'{res} {res.text}')

if args.docker_build:
    invoke('docker build -t dans-discord-bot .')

if args.docker_run:
    port = os.environ.get('DANS_DISCORD_BOT_PORT', 8000)
    invoke(f'docker run --detach --publish {port}:8000 --name dans-discord-bot dans-discord-bot')
