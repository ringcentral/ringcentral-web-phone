import React, { useState } from 'react';
import { auto } from 'manate/react';
import { Button, Input, Popover, Space, Tag } from 'antd';

import type CallSession from '../call-session';
import type InboundCallSession from '../call-session/inbound';
import type OutboundCallSession from '../call-session/outbound';
import { extractNumber } from '../utils';

const Session = (props: { callSession: CallSession }) => {
  const { callSession } = props;
  const render = () =>
    callSession.direction === 'inbound' ? (
      <InboundSession session={callSession as InboundCallSession} />
    ) : callSession.state === 'init' ? (
      <>Initiating an outbound call</>
    ) : (
      <OutboundSession session={callSession as OutboundCallSession} />
    );
  return auto(render, props);
};

const InboundSession = (props: { session: InboundCallSession }) => {
  const { session } = props;
  const [forwardPopoverVisible, setForwardPopoverVisible] = useState(false);
  const [forwardToNumber, setForwardToNumber] = useState('');
  const [replyPopoverVisible, setReplyPopoverVisible] = useState(false);
  const [replyText, setReplyText] = useState('On my way');
  const render = () => (
    <div>
      <div>
        <strong>{session.direction}</strong> call from {extractNumber(session.remotePeer)} to{' '}
        {extractNumber(session.localPeer)} <Tag color="blue">{session.state}</Tag>{' '}
        {session.state === 'ringing' ? (
          <Space>
            <Button onClick={() => session.answer()} type="primary">
              Answer
            </Button>
            <Button onClick={() => session.toVoiceMail()}>To Voicemail</Button>
            <Popover
              open={forwardPopoverVisible}
              onOpenChange={(visible) => setForwardPopoverVisible(visible)}
              trigger="click"
              placement="top"
              content={
                <Space direction="vertical">
                  <Input
                    placeholder="16501234567"
                    value={forwardToNumber}
                    onChange={(e) => setForwardToNumber(e.target.value.trim())}
                  />
                  <Button
                    onClick={() => {
                      session.forward(forwardToNumber);
                      setForwardPopoverVisible(false);
                    }}
                  >
                    Forward
                  </Button>
                </Space>
              }
            >
              <Button>Forward</Button>
            </Popover>
            <Popover
              open={replyPopoverVisible}
              onOpenChange={(visible) => setReplyPopoverVisible(visible)}
              trigger="click"
              placement="top"
              content={
                <Space direction="vertical">
                  <Input
                    placeholder="16501234567"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value.trim())}
                  />
                  <Button
                    onClick={() => {
                      session.reply(replyText);
                      setReplyPopoverVisible(false);
                    }}
                  >
                    Reply
                  </Button>
                </Space>
              }
            >
              <Button>Reply</Button>
            </Popover>
            <Button onClick={() => session.decline()} danger>
              Decline
            </Button>
          </Space>
        ) : null}
        {session.state === 'answered' ? <AnsweredSession session={session} /> : null}
      </div>
    </div>
  );
  return auto(render, props);
};

const OutboundSession = (props: { session: OutboundCallSession }) => {
  const { session } = props;
  const render = () => {
    return (
      <div>
        <div>
          <strong>{session.direction}</strong> call from {extractNumber(session.localPeer)} to{' '}
          {extractNumber(session.remotePeer)}
          <Tag color="blue">{session.state}</Tag>{' '}
          {session.state === 'answered' ? <AnsweredSession session={session} /> : null}
        </div>
      </div>
    );
  };
  return auto(render, props);
};

const AnsweredSession = (props: { session: CallSession }) => {
  const { session } = props;
  const [transferPopoverVisible, setTransferPopoverVisible] = useState(false);
  const [transferToNumber, setTransferToNumber] = useState('');
  const [dtmfPopoverVisible, setDtmfPopoverVisible] = useState(false);
  const [dtmfString, setDtmfString] = useState('');
  const render = () => {
    return (
      <Space>
        <Button onClick={() => session.hangup()} danger>
          Hang up
        </Button>
        <Popover
          open={transferPopoverVisible}
          onOpenChange={(visible) => setTransferPopoverVisible(visible)}
          trigger="click"
          placement="top"
          content={
            <Space direction="vertical">
              <Input
                placeholder="16501234567"
                value={transferToNumber}
                onChange={(e) => setTransferToNumber(e.target.value.trim())}
              />
              <Button
                onClick={() => {
                  session.transfer(transferToNumber);
                  setTransferPopoverVisible(false);
                }}
              >
                Transer
              </Button>
            </Space>
          }
        >
          <Button>Transfer</Button>
        </Popover>
        <Button onClick={() => session.startRecording()}>Start Recording</Button>
        <Button onClick={() => session.stopRecording()}>Stop Recording</Button>
        <Button onClick={() => session.hold()}>Hold</Button>
        <Button onClick={() => session.unhold()}>Unhold</Button>
        <Popover
          open={dtmfPopoverVisible}
          onOpenChange={(visible) => setDtmfPopoverVisible(visible)}
          trigger="click"
          placement="top"
          content={
            <Space direction="vertical">
              <Input placeholder="123#" value={dtmfString} onChange={(e) => setDtmfString(e.target.value.trim())} />
              <Button
                onClick={() => {
                  session.sendDtmf(dtmfString);
                  setDtmfString('');
                  setDtmfPopoverVisible(false);
                }}
              >
                Send
              </Button>
            </Space>
          }
        >
          <Button>Send DTMF</Button>
        </Popover>
      </Space>
    );
  };
  return auto(render, props);
};

export default Session;
