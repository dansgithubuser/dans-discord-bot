import requests

import argparse
import sys

parser = argparse.ArgumentParser()
parser.add_argument('origin')
parser.add_argument('channel')
parser.add_argument('--sender', default='test')
args = parser.parse_args()

requests.post(
    f'{args.origin}/channel/{args.channel}/message',
    json={
        'message': sys.stdin.read(),
        'sender': args.sender,
    },
)
