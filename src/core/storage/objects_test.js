import { default as test } from 'tape'
import * as objects from './objects'
import fs from 'fs'
import path from 'path'

const mock = {
  putObject({ bucket, object, stream }) {
    return Promise.resolve({ ok: true });
  },
  getObject({ bucket, object }) {
    return Promise.resolve({ ok: true });
  },
  removeObject({ bucket, object }) {
    return Promise.resolve({ ok: true });
  },
  listObjects({ bucket, prefix }) {
    return Promise.resolve({ ok: true, objects: ["one.txt", "two.txt", "three.txt"] });
  },
};

const fork = (m) => (t) => {
  t.plan(1);
  m.fork(
    () => t.ok(false),
    () => t.ok(true)
  );
};

const events = {
  dispatch: () => null
}

test(
  "put object",
  fork(
    objects
      .put(
        "test",
        "test.png",
        fs.createReadStream(path.resolve("./hyper63-logo.png"))
      )
      .runWith({ svc: mock, events })
  )
);
test("remove bucket", fork(objects.remove("beep").runWith({ svc: mock, events })));
test("list buckets", fork(objects.list().runWith({svc: mock, events})));
