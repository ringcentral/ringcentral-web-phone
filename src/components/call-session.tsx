import React, { useState } from 'react';
import { auto } from 'manate/react';
import { Button, Input, Popover, Space, Tag } from 'antd';

import type CallSession from '../call-session';
import type InboundCallSession from '../call-session/inbound';
import type OutboundCallSession from '../call-session/outbound';
import { extractNumber } from '../utils';
import store from '../store';

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
    <Space direction="vertical">
      <Space>
        <strong>{session.direction}</strong>
        <span>call from</span>
        {extractNumber(session.remotePeer)} to
        {extractNumber(session.localPeer)}
        <Tag color="blue">{session.state}</Tag>
      </Space>
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
    </Space>
  );
  return auto(render, props);
};

const OutboundSession = (props: { session: OutboundCallSession }) => {
  const { session } = props;
  const render = () => {
    return (
      <Space direction="vertical">
        <Space>
          <strong>{session.direction}</strong>
          <span>call from</span>
          {extractNumber(session.localPeer)} <span>to</span>
          {session.isConference ? <Tag color="red">Conference</Tag> : extractNumber(session.remotePeer)}
          <Tag color="blue">{session.state}</Tag>
        </Space>
        {session.state === 'answered' ? <AnsweredSession session={session} /> : null}
      </Space>
    );
  };
  return auto(render, props);
};

const AnsweredSession = (props: { session: CallSession }) => {
  const { session } = props;
  const [transferPopoverVisible, setTransferPopoverVisible] = useState(false);
  const [transferToNumber, setTransferToNumber] = useState('');
  const [flipPopoverVisible, setFlipPopoverVisible] = useState(false);
  const [flipToNumber, setFlipToNumber] = useState('');
  const [dtmfPopoverVisible, setDtmfPopoverVisible] = useState(false);
  const [dtmfString, setDtmfString] = useState('');
  const [inviteToConfPopoverVisible, setInviteToConfPopoverVisible] = useState(false);
  const [inviteToConfNumber, setInviteToConfNumber] = useState('');
  const [warmTransferMethods, setWarmTransferMethods] = useState<
    undefined | { complete: () => void; cancel: () => void }
  >(undefined);
  const render = () => {
    return (
      <Space>
        <Button onClick={() => session.hangup()} danger>
          {session.isConference ? 'End Conference' : 'Hang up'}
        </Button>
        {!session.isConference && (
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

                {warmTransferMethods && (
                  <>
                    <Button
                      onClick={() => {
                        warmTransferMethods.complete();
                        setWarmTransferMethods(undefined);
                        setTransferPopoverVisible(false);
                      }}
                    >
                      Complete
                    </Button>
                    <Button
                      onClick={() => {
                        warmTransferMethods.cancel();
                        setWarmTransferMethods(undefined);
                        setTransferPopoverVisible(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {!warmTransferMethods && (
                  <>
                    <Button
                      onClick={() => {
                        session.transfer(transferToNumber);
                        setTransferPopoverVisible(false);
                      }}
                    >
                      Transfer
                    </Button>
                    <Button
                      onClick={async () => {
                        const { complete, cancel } = await session.warmTransfer(transferToNumber);
                        setWarmTransferMethods({ complete, cancel });
                      }}
                    >
                      Warm Transer
                    </Button>
                  </>
                )}
              </Space>
            }
          >
            <Button>Transfer</Button>
          </Popover>
        )}
        {!session.isConference && (
          <Popover
            open={flipPopoverVisible}
            onOpenChange={(visible) => setFlipPopoverVisible(visible)}
            trigger="click"
            placement="top"
            content={
              <Space direction="vertical">
                <Input
                  placeholder="16501234567"
                  value={flipToNumber}
                  onChange={(e) => setFlipToNumber(e.target.value.trim())}
                />
                <Button
                  onClick={() => {
                    session.flip(flipToNumber);
                    setFlipPopoverVisible(false);
                  }}
                >
                  Flip
                </Button>
              </Space>
            }
          >
            <Button>Flip</Button>
          </Popover>
        )}
        <Button onClick={() => session.startRecording()}>Start Recording</Button>
        <Button onClick={() => session.stopRecording()}>Stop Recording</Button>
        {!session.isConference && (
          <>
            <Button onClick={() => session.hold()}>Hold</Button>
            <Button onClick={() => session.unhold()}>Unhold</Button>
          </>
        )}
        <Button onClick={() => session.mute()}>Mute</Button>
        <Button onClick={() => session.unmute()}>Unmute</Button>
        {!session.isConference && (
          <Button
            onClick={async () => {
              const result = await session.park();
              global.notifier.info({
                message: 'Call Park Result',
                description: <pre>{JSON.stringify(result, null, 2)}</pre>,
                duration: 10,
              });
            }}
          >
            Park
          </Button>
        )}
        {!session.isConference && (
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
        )}
        {session.isConference && (
          <Popover
            open={inviteToConfPopoverVisible}
            onOpenChange={(visible) => setInviteToConfPopoverVisible(visible)}
            trigger="click"
            placement="top"
            content={
              <Space direction="vertical">
                <Input
                  placeholder="16506668888"
                  value={inviteToConfNumber}
                  onChange={(e) => setInviteToConfNumber(e.target.value.trim())}
                />
                <Button
                  onClick={() => {
                    store.inviteToConference(inviteToConfNumber, session.sessionId);
                    setInviteToConfNumber('');
                    setInviteToConfPopoverVisible(false);
                  }}
                >
                  Invite
                </Button>
              </Space>
            }
          >
            <Button type="primary">Invite to Conference</Button>
          </Popover>
        )}
      </Space>
    );
  };
  return auto(render, props);
};

export default Session;
