function yt(e) {
  if (!e || !e.getInfo)
    throw new Error("ext.getInfo is not defined");
  const t = e.getInfo();
  console.group(`register extension ${t.id}`);
  function n(r) {
    console.error(`register extension ${t.id}: ${r}`);
  }
  for (let r of t.blocks) {
    e[r.opcode] || (n(`未设置的opcode function:${r.opcode}`), e[r.opcode] = () => {
      console.error(`当前opcode:${r.opcode}函数未定义!`);
    });
    for (let i of r.text.match(new RegExp("(?<=\\[).+?(?=\\])", "g")) || []) {
      if (!r.arguments) {
        n(`块${r.opcode}未设置arguments`);
        break;
      }
      r.arguments[i] || n(`块${r.opcode}未设置参数${i}`);
    }
  }
  for (let r in t.menus || {}) {
    const i = t.menus[r];
    i.items instanceof Array || e[i.items] || (n(`menu${r}的items函数未设置`), e[i.items] = () => ({
      text: "未设置！！！",
      value: "not setted"
    }));
  }
  console.groupEnd(), Scratch.extensions.register(e);
}
const bt = {
  "spineAnimation.extensionName": "spine骨骼动画",
  "spineAnimation.showRuntime.text": "console输出runtime信息并保存至window._runtime",
  "spineAnimation.pass.text": "直接执行reporter[A]",
  "spineAnimation.setSkinId.text": "将角色[TARGET_NAME]的skin设为ID为[SKIN_ID]的skin",
  "spineAnimation.spriteMenu.currentTarget": "当前角色",
  "spineAnimation.loadSkeleton.text": "加载id为[ID]的spine骨骼"
}, Et = {
  "spineAnimation.extensionName": "spine animation",
  "spineAnimation.showRuntime.text": "Print scratch runtime and assign to window._runtime",
  "spineAnimation.pass.text": "Run reporter[A] and ignore the return value",
  "spineAnimation.setSkinId.text": "Set the skin of character [TARGET_NAME] to the skin with ID [SKIN_ID]",
  "spineAnimation.spriteMenu.currentTarget": "Current target",
  "spineAnimation.loadSkeleton.text": "load spine skeleton with id:[ID]"
};
function kt(e) {
  const t = e.getFormatMessage({ "zh-cn": bt, en: Et });
  return function(n, r) {
    return t({
      default: n
    }, r);
  };
}
class xt {
  constructor(t, n) {
    this.info = { id: t, name: n, blocks: [], menus: {} };
  }
  getInfo() {
    return this.info;
  }
  buildBlock(t, n, r, i = {}) {
    let s;
    t instanceof Function ? s = t.name : s = t;
    const o = {
      opcode: s,
      text: n,
      blockType: r
    };
    Object.assign(o, i), this.info.blocks.push(o);
  }
  buildButton(t, n) {
    let r;
    t instanceof Function ? r = t.name : r = t, this.info.blocks.push({
      opcode: r,
      text: n,
      blockType: Scratch.BlockType.BUTTON,
      func: r
    });
  }
  buildMenu(t, n, r) {
    if (r instanceof Function) {
      const i = r.name || `menu_${t}`;
      this[i] ??= r, this.info.menus[t] = {
        acceptReporters: n,
        items: i
      };
    } else
      this.info.menus[t] = {
        acceptReporters: n,
        items: r
      };
  }
}
const Se = !1;
var At = Array.isArray, St = Array.prototype.indexOf, Tt = Array.from, It = Object.defineProperty, ie = Object.getOwnPropertyDescriptor, Nt = Object.prototype, Rt = Array.prototype, Dt = Object.getPrototypeOf, Be = Object.isExtensible;
function Mt(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function Ft() {
  var e, t, n = new Promise((r, i) => {
    e = r, t = i;
  });
  return { promise: n, resolve: e, reject: t };
}
const g = 2, Re = 4, Ct = 8, P = 16, Z = 32, J = 64, we = 128, I = 512, b = 1024, T = 2048, B = 4096, U = 8192, z = 16384, Ye = 32768, de = 65536, $e = 1 << 17, ze = 1 << 18, ye = 1 << 19, Ot = 1 << 20, W = 32768, Te = 1 << 21, He = 1 << 22, le = 1 << 23, xe = Symbol("$state"), We = new class extends Error {
  name = "StaleReactionError";
  message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}();
function Pt() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Bt() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function $t() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ut() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Lt() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
const qt = 2, w = Symbol();
function jt() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
function Kt(e) {
  return e === this.v;
}
let De = !1, Gt = !1;
function Vt() {
  De = !0;
}
let N = null;
function ve(e) {
  N = e;
}
function Yt(e, t = !1, n) {
  N = {
    p: N,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    l: De && !t ? { s: null, u: null, $: [] } : null
  };
}
function zt(e) {
  var t = (
    /** @type {ComponentContext} */
    N
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n)
      fn(r);
  }
  return t.i = !0, N = t.p, /** @type {T} */
  {};
}
function be() {
  return !De || N !== null && N.l === null;
}
let X = [];
function Ht() {
  var e = X;
  X = [], Mt(e);
}
function Me(e) {
  if (X.length === 0) {
    var t = X;
    queueMicrotask(() => {
      t === X && Ht();
    });
  }
  X.push(e);
}
function Ze(e) {
  var t = v;
  if (t === null)
    return d.f |= le, e;
  if ((t.f & Ye) === 0) {
    if ((t.f & we) === 0)
      throw e;
    t.b.error(e);
  } else
    pe(e, t);
}
function pe(e, t) {
  for (; t !== null; ) {
    if ((t.f & we) !== 0)
      try {
        t.b.error(e);
        return;
      } catch (n) {
        e = n;
      }
    t = t.parent;
  }
  throw e;
}
const ce = /* @__PURE__ */ new Set();
let y = null, A = null, R = [], Fe = null, Ie = !1;
class D {
  committed = !1;
  /**
   * The current values of any sources that are updated in this batch
   * They keys of this map are identical to `this.#previous`
   * @type {Map<Source, any>}
   */
  current = /* @__PURE__ */ new Map();
  /**
   * The values of any sources that are updated in this batch _before_ those updates took place.
   * They keys of this map are identical to `this.#current`
   * @type {Map<Source, any>}
   */
  previous = /* @__PURE__ */ new Map();
  /**
   * When the batch is committed (and the DOM is updated), we need to remove old branches
   * and append new ones by calling the functions added inside (if/each/key/etc) blocks
   * @type {Set<() => void>}
   */
  #n = /* @__PURE__ */ new Set();
  /**
   * If a fork is discarded, we need to destroy any effects that are no longer needed
   * @type {Set<(batch: Batch) => void>}
   */
  #r = /* @__PURE__ */ new Set();
  /**
   * The number of async effects that are currently in flight
   */
  #c = 0;
  /**
   * The number of async effects that are currently in flight, _not_ inside a pending boundary
   */
  #s = 0;
  /**
   * A deferred that resolves when the batch is committed, used with `settled()`
   * TODO replace with Promise.withResolvers once supported widely enough
   * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
   */
  #o = null;
  /**
   * Deferred effects (which run after async work has completed) that are DIRTY
   * @type {Effect[]}
   */
  #l = [];
  /**
   * Deferred effects that are MAYBE_DIRTY
   * @type {Effect[]}
   */
  #i = [];
  /**
   * A set of branches that still exist, but will be destroyed when this batch
   * is committed — we skip over these during `process`
   * @type {Set<Effect>}
   */
  skipped_effects = /* @__PURE__ */ new Set();
  is_fork = !1;
  is_deferred() {
    return this.is_fork || this.#s > 0;
  }
  /**
   *
   * @param {Effect[]} root_effects
   */
  process(t) {
    R = [], this.apply();
    var n = {
      parent: null,
      effect: null,
      effects: [],
      render_effects: [],
      block_effects: []
    };
    for (const r of t)
      this.#e(r, n);
    this.is_fork || this.#u(), this.is_deferred() ? (this.#t(n.effects), this.#t(n.render_effects), this.#t(n.block_effects)) : (y = null, Ue(n.render_effects), Ue(n.effects), this.#o?.resolve()), A = null;
  }
  /**
   * Traverse the effect tree, executing effects or stashing
   * them for later execution as appropriate
   * @param {Effect} root
   * @param {EffectTarget} target
   */
  #e(t, n) {
    t.f ^= b;
    for (var r = t.first; r !== null; ) {
      var i = r.f, s = (i & (Z | J)) !== 0, o = s && (i & b) !== 0, u = o || (i & U) !== 0 || this.skipped_effects.has(r);
      if ((r.f & we) !== 0 && r.b?.is_pending() && (n = {
        parent: n,
        effect: r,
        effects: [],
        render_effects: [],
        block_effects: []
      }), !u && r.fn !== null) {
        s ? r.f ^= b : (i & Re) !== 0 ? n.effects.push(r) : ae(r) && ((r.f & P) !== 0 && n.block_effects.push(r), oe(r));
        var l = r.first;
        if (l !== null) {
          r = l;
          continue;
        }
      }
      var f = r.parent;
      for (r = r.next; r === null && f !== null; )
        f === n.effect && (this.#t(n.effects), this.#t(n.render_effects), this.#t(n.block_effects), n = /** @type {EffectTarget} */
        n.parent), r = f.next, f = f.parent;
    }
  }
  /**
   * @param {Effect[]} effects
   */
  #t(t) {
    for (const n of t)
      ((n.f & T) !== 0 ? this.#l : this.#i).push(n), this.#f(n.deps), E(n, b);
  }
  /**
   * @param {Value[] | null} deps
   */
  #f(t) {
    if (t !== null)
      for (const n of t)
        (n.f & g) === 0 || (n.f & W) === 0 || (n.f ^= W, this.#f(
          /** @type {Derived} */
          n.deps
        ));
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Source} source
   * @param {any} value
   */
  capture(t, n) {
    this.previous.has(t) || this.previous.set(t, n), (t.f & le) === 0 && (this.current.set(t, t.v), A?.set(t, t.v));
  }
  activate() {
    y = this, this.apply();
  }
  deactivate() {
    y === this && (y = null, A = null);
  }
  flush() {
    if (this.activate(), R.length > 0) {
      if (Wt(), y !== null && y !== this)
        return;
    } else this.#c === 0 && this.process([]);
    this.deactivate();
  }
  discard() {
    for (const t of this.#r) t(this);
    this.#r.clear();
  }
  #u() {
    if (this.#s === 0) {
      for (const t of this.#n) t();
      this.#n.clear();
    }
    this.#c === 0 && this.#a();
  }
  #a() {
    if (ce.size > 1) {
      this.previous.clear();
      var t = A, n = !0, r = {
        parent: null,
        effect: null,
        effects: [],
        render_effects: [],
        block_effects: []
      };
      for (const s of ce) {
        if (s === this) {
          n = !1;
          continue;
        }
        const o = [];
        for (const [l, f] of this.current) {
          if (s.current.has(l))
            if (n && f !== s.current.get(l))
              s.current.set(l, f);
            else
              continue;
          o.push(l);
        }
        if (o.length === 0)
          continue;
        const u = [...s.current.keys()].filter((l) => !this.current.has(l));
        if (u.length > 0) {
          var i = R;
          R = [];
          const l = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Map();
          for (const h of o)
            Je(h, u, l, f);
          if (R.length > 0) {
            y = s, s.apply();
            for (const h of R)
              s.#e(h, r);
            s.deactivate();
          }
          R = i;
        }
      }
      y = null, A = t;
    }
    this.committed = !0, ce.delete(this);
  }
  /**
   *
   * @param {boolean} blocking
   */
  increment(t) {
    this.#c += 1, t && (this.#s += 1);
  }
  /**
   *
   * @param {boolean} blocking
   */
  decrement(t) {
    this.#c -= 1, t && (this.#s -= 1), this.revive();
  }
  revive() {
    for (const t of this.#l)
      E(t, T), te(t);
    for (const t of this.#i)
      E(t, B), te(t);
    this.#l = [], this.#i = [], this.flush();
  }
  /** @param {() => void} fn */
  oncommit(t) {
    this.#n.add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    this.#r.add(t);
  }
  settled() {
    return (this.#o ??= Ft()).promise;
  }
  static ensure() {
    if (y === null) {
      const t = y = new D();
      ce.add(y), D.enqueue(() => {
        y === t && t.flush();
      });
    }
    return y;
  }
  /** @param {() => void} task */
  static enqueue(t) {
    Me(t);
  }
  apply() {
  }
}
function Wt() {
  var e = q;
  Ie = !0;
  var t = null;
  try {
    var n = 0;
    for (me(!0); R.length > 0; ) {
      var r = D.ensure();
      if (n++ > 1e3) {
        var i, s;
        Zt();
      }
      r.process(R), L.clear();
    }
  } finally {
    Ie = !1, me(e), Fe = null;
  }
}
function Zt() {
  try {
    Pt();
  } catch (e) {
    pe(e, Fe);
  }
}
let C = null;
function Ue(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if ((r.f & (z | U)) === 0 && ae(r) && (C = /* @__PURE__ */ new Set(), oe(r), r.deps === null && r.first === null && r.nodes_start === null && (r.teardown === null && r.ac === null ? ht(r) : r.fn = null), C?.size > 0)) {
        L.clear();
        for (const i of C) {
          if ((i.f & (z | U)) !== 0) continue;
          const s = [i];
          let o = i.parent;
          for (; o !== null; )
            C.has(o) && (C.delete(o), s.push(o)), o = o.parent;
          for (let u = s.length - 1; u >= 0; u--) {
            const l = s[u];
            (l.f & (z | U)) === 0 && oe(l);
          }
        }
        C.clear();
      }
    }
    C = null;
  }
}
function Je(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const i of e.reactions) {
      const s = i.f;
      (s & g) !== 0 ? Je(
        /** @type {Derived} */
        i,
        t,
        n,
        r
      ) : (s & (He | P)) !== 0 && (s & T) === 0 && // we may have scheduled this one already
      Qe(i, t, r) && (E(i, T), te(
        /** @type {Effect} */
        i
      ));
    }
}
function Qe(e, t, n) {
  const r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (const i of e.deps) {
      if (t.includes(i))
        return !0;
      if ((i.f & g) !== 0 && Qe(
        /** @type {Derived} */
        i,
        t,
        n
      ))
        return n.set(
          /** @type {Derived} */
          i,
          !0
        ), !0;
    }
  return n.set(e, !1), !1;
}
function te(e) {
  for (var t = Fe = e; t.parent !== null; ) {
    t = t.parent;
    var n = t.f;
    if (Ie && t === v && (n & P) !== 0 && (n & ze) === 0)
      return;
    if ((n & (J | Z)) !== 0) {
      if ((n & b) === 0) return;
      t.f ^= b;
    }
  }
  R.push(t);
}
function Jt(e) {
  let t = 0, n = Oe(0), r;
  return () => {
    Ee() && (ee(n), an(() => (t === 0 && (r = wn(() => e(() => se(n)))), t += 1, () => {
      Me(() => {
        t -= 1, t === 0 && (r?.(), r = void 0, se(n));
      });
    })));
  };
}
var Qt = de | ye | we;
function Xt(e, t, n) {
  new en(e, t, n);
}
class en {
  /** @type {Boundary | null} */
  parent;
  #n = !1;
  /** @type {TemplateNode} */
  #r;
  /** @type {TemplateNode | null} */
  #c = null;
  /** @type {BoundaryProps} */
  #s;
  /** @type {((anchor: Node) => void)} */
  #o;
  /** @type {Effect} */
  #l;
  /** @type {Effect | null} */
  #i = null;
  /** @type {Effect | null} */
  #e = null;
  /** @type {Effect | null} */
  #t = null;
  /** @type {DocumentFragment | null} */
  #f = null;
  /** @type {TemplateNode | null} */
  #u = null;
  #a = 0;
  #h = 0;
  #d = !1;
  /**
   * A source containing the number of pending async deriveds/expressions.
   * Only created if `$effect.pending()` is used inside the boundary,
   * otherwise updating the source results in needless `Batch.ensure()`
   * calls followed by no-op flushes
   * @type {Source<number> | null}
   */
  #_ = null;
  #w = Jt(() => (this.#_ = Oe(this.#a), () => {
    this.#_ = null;
  }));
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   */
  constructor(t, n, r) {
    this.#r = t, this.#s = n, this.#o = r, this.parent = /** @type {Effect} */
    v.b, this.#n = !!this.#s.pending, this.#l = cn(() => {
      v.b = this;
      {
        var i = this.#m();
        try {
          this.#i = V(() => r(i));
        } catch (s) {
          this.error(s);
        }
        this.#h > 0 ? this.#p() : this.#n = !1;
      }
      return () => {
        this.#u?.remove();
      };
    }, Qt);
  }
  #y() {
    try {
      this.#i = V(() => this.#o(this.#r));
    } catch (t) {
      this.error(t);
    }
    this.#n = !1;
  }
  #b() {
    const t = this.#s.pending;
    t && (this.#e = V(() => t(this.#r)), D.enqueue(() => {
      var n = this.#m();
      this.#i = this.#v(() => (D.ensure(), V(() => this.#o(n)))), this.#h > 0 ? this.#p() : (_e(
        /** @type {Effect} */
        this.#e,
        () => {
          this.#e = null;
        }
      ), this.#n = !1);
    }));
  }
  #m() {
    var t = this.#r;
    return this.#n && (this.#u = ft(), this.#r.before(this.#u), t = this.#u), t;
  }
  /**
   * Returns `true` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_pending() {
    return this.#n || !!this.parent && this.parent.is_pending();
  }
  has_pending_snippet() {
    return !!this.#s.pending;
  }
  /**
   * @param {() => Effect | null} fn
   */
  #v(t) {
    var n = v, r = d, i = N;
    j(this.#l), S(this.#l), ve(this.#l.ctx);
    try {
      return t();
    } catch (s) {
      return Ze(s), null;
    } finally {
      j(n), S(r), ve(i);
    }
  }
  #p() {
    const t = (
      /** @type {(anchor: Node) => void} */
      this.#s.pending
    );
    this.#i !== null && (this.#f = document.createDocumentFragment(), this.#f.append(
      /** @type {TemplateNode} */
      this.#u
    ), vn(this.#i, this.#f)), this.#e === null && (this.#e = V(() => t(this.#r)));
  }
  /**
   * Updates the pending count associated with the currently visible pending snippet,
   * if any, such that we can replace the snippet with content once work is done
   * @param {1 | -1} d
   */
  #g(t) {
    if (!this.has_pending_snippet()) {
      this.parent && this.parent.#g(t);
      return;
    }
    this.#h += t, this.#h === 0 && (this.#n = !1, this.#e && _e(this.#e, () => {
      this.#e = null;
    }), this.#f && (this.#r.before(this.#f), this.#f = null));
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   */
  update_pending_count(t) {
    this.#g(t), this.#a += t, this.#_ && nt(this.#_, this.#a);
  }
  get_effect_pending() {
    return this.#w(), ee(
      /** @type {Source<number>} */
      this.#_
    );
  }
  /** @param {unknown} error */
  error(t) {
    var n = this.#s.onerror;
    let r = this.#s.failed;
    if (this.#d || !n && !r)
      throw t;
    this.#i && (F(this.#i), this.#i = null), this.#e && (F(this.#e), this.#e = null), this.#t && (F(this.#t), this.#t = null);
    var i = !1, s = !1;
    const o = () => {
      if (i) {
        jt();
        return;
      }
      i = !0, s && Lt(), D.ensure(), this.#a = 0, this.#t !== null && _e(this.#t, () => {
        this.#t = null;
      }), this.#n = this.has_pending_snippet(), this.#i = this.#v(() => (this.#d = !1, V(() => this.#o(this.#r)))), this.#h > 0 ? this.#p() : this.#n = !1;
    };
    var u = d;
    try {
      S(null), s = !0, n?.(t, o), s = !1;
    } catch (l) {
      pe(l, this.#l && this.#l.parent);
    } finally {
      S(u);
    }
    r && Me(() => {
      this.#t = this.#v(() => {
        D.ensure(), this.#d = !0;
        try {
          return V(() => {
            r(
              this.#r,
              () => t,
              () => o
            );
          });
        } catch (l) {
          return pe(
            l,
            /** @type {Effect} */
            this.#l.parent
          ), null;
        } finally {
          this.#d = !1;
        }
      });
    });
  }
}
function Xe(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      F(
        /** @type {Effect} */
        t[n]
      );
  }
}
function tn(e) {
  for (var t = e.parent; t !== null; ) {
    if ((t.f & g) === 0)
      return (t.f & z) === 0 ? (
        /** @type {Effect} */
        t
      ) : null;
    t = t.parent;
  }
  return null;
}
function Ce(e) {
  var t, n = v;
  j(tn(e));
  try {
    e.f &= ~W, Xe(e), t = mt(e);
  } finally {
    j(n);
  }
  return t;
}
function et(e) {
  var t = Ce(e);
  if (e.equals(t) || (y?.is_fork || (e.v = t), e.wv = vt()), !ue)
    if (A !== null)
      Ee() && A.set(e, t);
    else {
      var n = (e.f & I) === 0 ? B : b;
      E(e, n);
    }
}
let Ne = /* @__PURE__ */ new Set();
const L = /* @__PURE__ */ new Map();
let tt = !1;
function Oe(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: Kt,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function $(e, t) {
  const n = Oe(e);
  return pn(n), n;
}
function Y(e, t, n = !1) {
  d !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!M || (d.f & $e) !== 0) && be() && (d.f & (g | P | He | $e)) !== 0 && !O?.includes(e) && Ut();
  let r = n ? re(t) : t;
  return nt(e, r);
}
function nt(e, t) {
  if (!e.equals(t)) {
    var n = e.v;
    ue ? L.set(e, t) : L.set(e, n), e.v = t;
    var r = D.ensure();
    r.capture(e, n), (e.f & g) !== 0 && ((e.f & T) !== 0 && Ce(
      /** @type {Derived} */
      e
    ), E(e, (e.f & I) !== 0 ? b : B)), e.wv = vt(), rt(e, T), be() && v !== null && (v.f & b) !== 0 && (v.f & (Z | J)) === 0 && (x === null ? mn([e]) : x.push(e)), !r.is_fork && Ne.size > 0 && !tt && nn();
  }
  return t;
}
function nn() {
  tt = !1;
  var e = q;
  me(!0);
  const t = Array.from(Ne);
  try {
    for (const n of t)
      (n.f & b) !== 0 && E(n, B), ae(n) && oe(n);
  } finally {
    me(e);
  }
  Ne.clear();
}
function se(e) {
  Y(e, e.v + 1);
}
function rt(e, t) {
  var n = e.reactions;
  if (n !== null)
    for (var r = be(), i = n.length, s = 0; s < i; s++) {
      var o = n[s], u = o.f;
      if (!(!r && o === v)) {
        var l = (u & T) === 0;
        if (l && E(o, t), (u & g) !== 0) {
          var f = (
            /** @type {Derived} */
            o
          );
          A?.delete(f), (u & W) === 0 && (u & I && (o.f |= W), rt(f, B));
        } else l && ((u & P) !== 0 && C !== null && C.add(
          /** @type {Effect} */
          o
        ), te(
          /** @type {Effect} */
          o
        ));
      }
    }
}
function re(e) {
  if (typeof e != "object" || e === null || xe in e)
    return e;
  const t = Dt(e);
  if (t !== Nt && t !== Rt)
    return e;
  var n = /* @__PURE__ */ new Map(), r = At(e), i = /* @__PURE__ */ $(0), s = H, o = (u) => {
    if (H === s)
      return u();
    var l = d, f = H;
    S(null), je(s);
    var h = u();
    return S(l), je(f), h;
  };
  return r && n.set("length", /* @__PURE__ */ $(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(u, l, f) {
        (!("value" in f) || f.configurable === !1 || f.enumerable === !1 || f.writable === !1) && Bt();
        var h = n.get(l);
        return h === void 0 ? h = o(() => {
          var _ = /* @__PURE__ */ $(f.value);
          return n.set(l, _), _;
        }) : Y(h, f.value, !0), !0;
      },
      deleteProperty(u, l) {
        var f = n.get(l);
        if (f === void 0) {
          if (l in u) {
            const h = o(() => /* @__PURE__ */ $(w));
            n.set(l, h), se(i);
          }
        } else
          Y(f, w), se(i);
        return !0;
      },
      get(u, l, f) {
        if (l === xe)
          return e;
        var h = n.get(l), _ = l in u;
        if (h === void 0 && (!_ || ie(u, l)?.writable) && (h = o(() => {
          var c = re(_ ? u[l] : w), p = /* @__PURE__ */ $(c);
          return p;
        }), n.set(l, h)), h !== void 0) {
          var a = ee(h);
          return a === w ? void 0 : a;
        }
        return Reflect.get(u, l, f);
      },
      getOwnPropertyDescriptor(u, l) {
        var f = Reflect.getOwnPropertyDescriptor(u, l);
        if (f && "value" in f) {
          var h = n.get(l);
          h && (f.value = ee(h));
        } else if (f === void 0) {
          var _ = n.get(l), a = _?.v;
          if (_ !== void 0 && a !== w)
            return {
              enumerable: !0,
              configurable: !0,
              value: a,
              writable: !0
            };
        }
        return f;
      },
      has(u, l) {
        if (l === xe)
          return !0;
        var f = n.get(l), h = f !== void 0 && f.v !== w || Reflect.has(u, l);
        if (f !== void 0 || v !== null && (!h || ie(u, l)?.writable)) {
          f === void 0 && (f = o(() => {
            var a = h ? re(u[l]) : w, c = /* @__PURE__ */ $(a);
            return c;
          }), n.set(l, f));
          var _ = ee(f);
          if (_ === w)
            return !1;
        }
        return h;
      },
      set(u, l, f, h) {
        var _ = n.get(l), a = l in u;
        if (r && l === "length")
          for (var c = f; c < /** @type {Source<number>} */
          _.v; c += 1) {
            var p = n.get(c + "");
            p !== void 0 ? Y(p, w) : c in u && (p = o(() => /* @__PURE__ */ $(w)), n.set(c + "", p));
          }
        if (_ === void 0)
          (!a || ie(u, l)?.writable) && (_ = o(() => /* @__PURE__ */ $(void 0)), Y(_, re(f)), n.set(l, _));
        else {
          a = _.v !== w;
          var K = o(() => re(f));
          Y(_, K);
        }
        var G = Reflect.getOwnPropertyDescriptor(u, l);
        if (G?.set && G.set.call(h, f), !a) {
          if (r && typeof l == "string") {
            var Pe = (
              /** @type {Source<number>} */
              n.get("length")
            ), ke = Number(l);
            Number.isInteger(ke) && ke >= Pe.v && Y(Pe, ke + 1);
          }
          se(i);
        }
        return !0;
      },
      ownKeys(u) {
        ee(i);
        var l = Reflect.ownKeys(u).filter((_) => {
          var a = n.get(_);
          return a === void 0 || a.v !== w;
        });
        for (var [f, h] of n)
          h.v !== w && !(f in u) && l.push(f);
        return l;
      },
      setPrototypeOf() {
        $t();
      }
    }
  );
}
var Le, it, st, lt;
function rn() {
  if (Le === void 0) {
    Le = window, it = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, n = Text.prototype;
    st = ie(t, "firstChild").get, lt = ie(t, "nextSibling").get, Be(e) && (e.__click = void 0, e.__className = void 0, e.__attributes = null, e.__style = void 0, e.__e = void 0), Be(n) && (n.__t = void 0);
  }
}
function ft(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function sn(e) {
  return st.call(e);
}
// @__NO_SIDE_EFFECTS__
function ot(e) {
  return lt.call(e);
}
function ut(e) {
  var t = d, n = v;
  S(null), j(null);
  try {
    return e();
  } finally {
    S(t), j(n);
  }
}
function ln(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function ne(e, t, n) {
  var r = v;
  r !== null && (r.f & U) !== 0 && (e |= U);
  var i = {
    ctx: N,
    deps: null,
    nodes_start: null,
    nodes_end: null,
    f: e | T | I,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: r,
    b: r && r.b,
    prev: null,
    teardown: null,
    transitions: null,
    wv: 0,
    ac: null
  };
  if (n)
    try {
      oe(i), i.f |= Ye;
    } catch (u) {
      throw F(i), u;
    }
  else t !== null && te(i);
  var s = i;
  if (n && s.deps === null && s.teardown === null && s.nodes_start === null && s.first === s.last && // either `null`, or a singular child
  (s.f & ye) === 0 && (s = s.first, (e & P) !== 0 && (e & de) !== 0 && s !== null && (s.f |= de)), s !== null && (s.parent = r, r !== null && ln(s, r), d !== null && (d.f & g) !== 0 && (e & J) === 0)) {
    var o = (
      /** @type {Derived} */
      d
    );
    (o.effects ??= []).push(s);
  }
  return i;
}
function Ee() {
  return d !== null && !M;
}
function fn(e) {
  return ne(Re | Ot, e, !1);
}
function on(e) {
  D.ensure();
  const t = ne(J | ye, e, !0);
  return (n = {}) => new Promise((r) => {
    n.outro ? _e(t, () => {
      F(t), r(void 0);
    }) : (F(t), r(void 0));
  });
}
function un(e) {
  return ne(Re, e, !1);
}
function an(e, t = 0) {
  return ne(Ct | t, e, !0);
}
function cn(e, t = 0) {
  var n = ne(P | t, e, !0);
  return n;
}
function V(e) {
  return ne(Z | ye, e, !0);
}
function at(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = ue, r = d;
    qe(!0), S(null);
    try {
      t.call(null);
    } finally {
      qe(n), S(r);
    }
  }
}
function ct(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const i = n.ac;
    i !== null && ut(() => {
      i.abort(We);
    });
    var r = n.next;
    (n.f & J) !== 0 ? n.parent = null : F(n, t), n = r;
  }
}
function hn(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    (t.f & Z) === 0 && F(t), t = n;
  }
}
function F(e, t = !0) {
  var n = !1;
  (t || (e.f & ze) !== 0) && e.nodes_start !== null && e.nodes_end !== null && (_n(
    e.nodes_start,
    /** @type {TemplateNode} */
    e.nodes_end
  ), n = !0), ct(e, t && !n), ge(e, 0), E(e, z);
  var r = e.transitions;
  if (r !== null)
    for (const s of r)
      s.stop();
  at(e);
  var i = e.parent;
  i !== null && i.first !== null && ht(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes_start = e.nodes_end = e.ac = null;
}
function _n(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : (
      /** @type {TemplateNode} */
      /* @__PURE__ */ ot(e)
    );
    e.remove(), e = n;
  }
}
function ht(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function _e(e, t, n = !0) {
  var r = [];
  _t(e, r, !0), dn(r, () => {
    n && F(e), t && t();
  });
}
function dn(e, t) {
  var n = e.length;
  if (n > 0) {
    var r = () => --n || t();
    for (var i of e)
      i.out(r);
  } else
    t();
}
function _t(e, t, n) {
  if ((e.f & U) === 0) {
    if (e.f ^= U, e.transitions !== null)
      for (const o of e.transitions)
        (o.is_global || n) && t.push(o);
    for (var r = e.first; r !== null; ) {
      var i = r.next, s = (r.f & de) !== 0 || // If this is a branch effect without a block effect parent,
      // it means the parent block effect was pruned. In that case,
      // transparency information was transferred to the branch effect.
      (r.f & Z) !== 0 && (e.f & P) !== 0;
      _t(r, t, s ? n : !1), r = i;
    }
  }
}
function vn(e, t) {
  for (var n = e.nodes_start, r = e.nodes_end; n !== null; ) {
    var i = n === r ? null : (
      /** @type {TemplateNode} */
      /* @__PURE__ */ ot(n)
    );
    t.append(n), n = i;
  }
}
let q = !1;
function me(e) {
  q = e;
}
let ue = !1;
function qe(e) {
  ue = e;
}
let d = null, M = !1;
function S(e) {
  d = e;
}
let v = null;
function j(e) {
  v = e;
}
let O = null;
function pn(e) {
  d !== null && (O === null ? O = [e] : O.push(e));
}
let m = null, k = 0, x = null;
function mn(e) {
  x = e;
}
let dt = 1, fe = 0, H = fe;
function je(e) {
  H = e;
}
function vt() {
  return ++dt;
}
function ae(e) {
  var t = e.f;
  if ((t & T) !== 0)
    return !0;
  if (t & g && (e.f &= ~W), (t & B) !== 0) {
    var n = e.deps;
    if (n !== null)
      for (var r = n.length, i = 0; i < r; i++) {
        var s = n[i];
        if (ae(
          /** @type {Derived} */
          s
        ) && et(
          /** @type {Derived} */
          s
        ), s.wv > e.wv)
          return !0;
      }
    (t & I) !== 0 && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    A === null && E(e, b);
  }
  return !1;
}
function pt(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !O?.includes(e))
    for (var i = 0; i < r.length; i++) {
      var s = r[i];
      (s.f & g) !== 0 ? pt(
        /** @type {Derived} */
        s,
        t,
        !1
      ) : t === s && (n ? E(s, T) : (s.f & b) !== 0 && E(s, B), te(
        /** @type {Effect} */
        s
      ));
    }
}
function mt(e) {
  var t = m, n = k, r = x, i = d, s = O, o = N, u = M, l = H, f = e.f;
  m = /** @type {null | Value[]} */
  null, k = 0, x = null, d = (f & (Z | J)) === 0 ? e : null, O = null, ve(e.ctx), M = !1, H = ++fe, e.ac !== null && (ut(() => {
    e.ac.abort(We);
  }), e.ac = null);
  try {
    e.f |= Te;
    var h = (
      /** @type {Function} */
      e.fn
    ), _ = h(), a = e.deps;
    if (m !== null) {
      var c;
      if (ge(e, k), a !== null && k > 0)
        for (a.length = k + m.length, c = 0; c < m.length; c++)
          a[k + c] = m[c];
      else
        e.deps = a = m;
      if (q && Ee() && (e.f & I) !== 0)
        for (c = k; c < a.length; c++)
          (a[c].reactions ??= []).push(e);
    } else a !== null && k < a.length && (ge(e, k), a.length = k);
    if (be() && x !== null && !M && a !== null && (e.f & (g | B | T)) === 0)
      for (c = 0; c < /** @type {Source[]} */
      x.length; c++)
        pt(
          x[c],
          /** @type {Effect} */
          e
        );
    return i !== null && i !== e && (fe++, x !== null && (r === null ? r = x : r.push(.../** @type {Source[]} */
    x))), (e.f & le) !== 0 && (e.f ^= le), _;
  } catch (p) {
    return Ze(p);
  } finally {
    e.f ^= Te, m = t, k = n, x = r, d = i, O = s, ve(o), M = u, H = l;
  }
}
function gn(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var r = St.call(n, e);
    if (r !== -1) {
      var i = n.length - 1;
      i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
    }
  }
  n === null && (t.f & g) !== 0 && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (m === null || !m.includes(t)) && (E(t, B), (t.f & I) !== 0 && (t.f ^= I, t.f &= ~W), Xe(
    /** @type {Derived} **/
    t
  ), ge(
    /** @type {Derived} **/
    t,
    0
  ));
}
function ge(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t; r < n.length; r++)
      gn(e, n[r]);
}
function oe(e) {
  var t = e.f;
  if ((t & z) === 0) {
    E(e, b);
    var n = v, r = q;
    v = e, q = !0;
    try {
      (t & P) !== 0 ? hn(e) : ct(e), at(e);
      var i = mt(e);
      e.teardown = typeof i == "function" ? i : null, e.wv = dt;
      var s;
      Se && Gt && (e.f & T) !== 0 && e.deps;
    } finally {
      q = r, v = n;
    }
  }
}
function ee(e) {
  var t = e.f, n = (t & g) !== 0;
  if (d !== null && !M) {
    var r = v !== null && (v.f & z) !== 0;
    if (!r && !O?.includes(e)) {
      var i = d.deps;
      if ((d.f & Te) !== 0)
        e.rv < fe && (e.rv = fe, m === null && i !== null && i[k] === e ? k++ : m === null ? m = [e] : m.includes(e) || m.push(e));
      else {
        (d.deps ??= []).push(e);
        var s = e.reactions;
        s === null ? e.reactions = [d] : s.includes(d) || s.push(d);
      }
    }
  }
  if (ue) {
    if (L.has(e))
      return L.get(e);
    if (n) {
      var o = (
        /** @type {Derived} */
        e
      ), u = o.v;
      return ((o.f & b) === 0 && o.reactions !== null || wt(o)) && (u = Ce(o)), L.set(o, u), u;
    }
  } else n && !A?.has(e) && (o = /** @type {Derived} */
  e, ae(o) && et(o), q && Ee() && (o.f & I) === 0 && gt(o));
  if (A?.has(e))
    return A.get(e);
  if ((e.f & le) !== 0)
    throw e.v;
  return e.v;
}
function gt(e) {
  if (e.deps !== null) {
    e.f ^= I;
    for (const t of e.deps)
      (t.reactions ??= []).push(e), (t.f & g) !== 0 && (t.f & I) === 0 && gt(
        /** @type {Derived} */
        t
      );
  }
}
function wt(e) {
  if (e.v === w) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (L.has(t) || (t.f & g) !== 0 && wt(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function wn(e) {
  var t = M;
  try {
    return M = !0, e();
  } finally {
    M = t;
  }
}
const yn = -7169;
function E(e, t) {
  e.f = e.f & yn | t;
}
const bn = ["touchstart", "touchmove"];
function En(e) {
  return bn.includes(e);
}
const kn = /* @__PURE__ */ new Set(), Ke = /* @__PURE__ */ new Set();
let Ge = null;
function he(e) {
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, i = e.composedPath?.() || [], s = (
    /** @type {null | Element} */
    i[0] || e.target
  );
  Ge = e;
  var o = 0, u = Ge === e && e.__root;
  if (u) {
    var l = i.indexOf(u);
    if (l !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e.__root = t;
      return;
    }
    var f = i.indexOf(t);
    if (f === -1)
      return;
    l <= f && (o = l);
  }
  if (s = /** @type {Element} */
  i[o] || e.target, s !== t) {
    It(e, "currentTarget", {
      configurable: !0,
      get() {
        return s || n;
      }
    });
    var h = d, _ = v;
    S(null), j(null);
    try {
      for (var a, c = []; s !== null; ) {
        var p = s.assignedSlot || s.parentNode || /** @type {any} */
        s.host || null;
        try {
          var K = s["__" + r];
          K != null && (!/** @type {any} */
          s.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === s) && K.call(s, e);
        } catch (G) {
          a ? c.push(G) : a = G;
        }
        if (e.cancelBubble || p === t || p === null)
          break;
        s = p;
      }
      if (a) {
        for (let G of c)
          queueMicrotask(() => {
            throw G;
          });
        throw a;
      }
    } finally {
      e.__root = t, delete e.currentTarget, S(h), j(_);
    }
  }
}
function xn(e) {
  var t = document.createElement("template");
  return t.innerHTML = e.replaceAll("<!>", "<!---->"), t.content;
}
function An(e, t) {
  var n = (
    /** @type {Effect} */
    v
  );
  n.nodes_start === null && (n.nodes_start = e, n.nodes_end = t);
}
// @__NO_SIDE_EFFECTS__
function Sn(e, t) {
  var n = (t & qt) !== 0, r, i = !e.startsWith("<!>");
  return () => {
    r === void 0 && (r = xn(i ? e : "<!>" + e), r = /** @type {Node} */
    /* @__PURE__ */ sn(r));
    var s = (
      /** @type {TemplateNode} */
      n || it ? document.importNode(r, !0) : r.cloneNode(!0)
    );
    return An(s, s), s;
  };
}
function Tn(e, t) {
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function In(e, t) {
  return Nn(e, t);
}
const Q = /* @__PURE__ */ new Map();
function Nn(e, { target: t, anchor: n, props: r = {}, events: i, context: s, intro: o = !0 }) {
  rn();
  var u = /* @__PURE__ */ new Set(), l = (_) => {
    for (var a = 0; a < _.length; a++) {
      var c = _[a];
      if (!u.has(c)) {
        u.add(c);
        var p = En(c);
        t.addEventListener(c, he, { passive: p });
        var K = Q.get(c);
        K === void 0 ? (document.addEventListener(c, he, { passive: p }), Q.set(c, 1)) : Q.set(c, K + 1);
      }
    }
  };
  l(Tt(kn)), Ke.add(l);
  var f = void 0, h = on(() => {
    var _ = n ?? t.appendChild(ft());
    return Xt(
      /** @type {TemplateNode} */
      _,
      {
        pending: () => {
        }
      },
      (a) => {
        if (s) {
          Yt({});
          var c = (
            /** @type {ComponentContext} */
            N
          );
          c.c = s;
        }
        i && (r.$$events = i), f = e(a, r) || {}, s && zt();
      }
    ), () => {
      for (var a of u) {
        t.removeEventListener(a, he);
        var c = (
          /** @type {number} */
          Q.get(a)
        );
        --c === 0 ? (document.removeEventListener(a, he), Q.delete(a)) : Q.set(a, c);
      }
      Ke.delete(l), _ !== n && _.parentNode?.removeChild(_);
    };
  });
  return Rn.set(f, h), f;
}
let Rn = /* @__PURE__ */ new WeakMap();
function Dn(e, t) {
  un(() => {
    var n = e.getRootNode(), r = (
      /** @type {ShadowRoot} */
      n.host ? (
        /** @type {ShadowRoot} */
        n
      ) : (
        /** @type {Document} */
        n.head ?? /** @type {Document} */
        n.ownerDocument.head
      )
    );
    if (!r.querySelector("#" + t.hash)) {
      const i = document.createElement("style");
      i.id = t.hash, i.textContent = t.code, r.appendChild(i);
    }
  });
}
const Mn = "5";
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add(Mn);
Vt();
var Fn = /* @__PURE__ */ Sn('<div class="modal svelte-1wmebmf">aaa</div>');
const Cn = {
  hash: "svelte-1wmebmf",
  code: ".modal.svelte-1wmebmf{background-color:black;opacity:0.9;}"
};
function On(e) {
  Dn(e, Cn);
  var t = Fn();
  Tn(e, t);
}
class Pn {
  constructor(t, n = "test") {
    this.storage = t, this.extId = n;
  }
  async loadFile(t) {
    return fetch(`https://m.ccw.site/user_projects_assets/${t}`);
  }
  async storeFile(t = "text/plain", n, r = "", i) {
    let s;
    if (i instanceof String)
      s = new TextEncoder().encode(i).buffer;
    else if (i instanceof Blob)
      s = await i.arrayBuffer();
    else if (i instanceof Uint8Array)
      s = i.buffer;
    else if (i instanceof ArrayBuffer)
      s = i;
    else
      throw new Error(`cannot convert ${i} to array buffer`);
    return this.storage.store(
      { contentType: t },
      r,
      s,
      n
    );
  }
  createUI(t) {
    let n = t;
    return n || (n = document.createElement("div"), n.style.position = "fixed", n.style.top = "0px", n.style.left = "0px", document.body.appendChild(n)), In(On, {
      target: n
    });
  }
}
const { BlockType: Ve, ArgumentType: Ae } = Scratch;
class Bn extends xt {
  constructor(t) {
    super("spineAnimation", "foo"), this.runtime = t, console.log(t), this.translate = kt(t), this.prepareInfo();
  }
  prepareInfo() {
    this.info.name = this.translate("spineAnimation.extensionName"), this.buildBlock(
      this.setSkinId,
      this.translate("spineAnimation.setSkinId.text"),
      Ve.COMMAND,
      {
        arguments: {
          TARGET_NAME: {
            type: Ae.STRING,
            menu: "sprite_menu"
          },
          SKIN_ID: {
            type: Ae.NUMBER,
            default: "0"
          }
        }
      }
    ), this.buildBlock(
      this.loadSkeleton,
      this.translate("spineAnimation.loadSkeleton.text"),
      Ve.COMMAND,
      {
        arguments: {
          ID: {
            type: Ae.STRING,
            menu: "skeleton_menu"
          }
        }
      }
    ), this.buildButton(this.initUI, "abcd"), this.buildMenu("sprite_menu", !0, this.spriteMenu), this.buildMenu("skeleton_menu", !0, this.skeletonMenu), console.log(this.info);
  }
  spriteMenu() {
    const t = [
      {
        text: this.translate("spineAnimation.spriteMenu.currentTarget"),
        value: "__this__"
      }
    ];
    for (const n of this.runtime.targets)
      n.isSprite() && n.id !== this.runtime.getEditingTarget()?.id && t.push({
        text: n.sprite.name,
        value: n.sprite.name
      });
    return t;
  }
  skeletonMenu() {
    return [{ text: "test", value: "spine/Hina_home.skel" }];
  }
  setSkinId(t, n) {
    const { TARGET_NAME: r, SKIN_ID: i } = t;
    let s;
    r === "__this__" ? s = n.target : (s = this.runtime.targets.find(
      (f) => f.isSprite() && f.getName() === r
    ), s || console.warn(`找不到名为${r}的角色`));
    const o = s.drawableID, u = this.runtime.renderer._allDrawables[o], l = this.runtime.renderer._allSkins[i];
    l && (u.skin = l);
  }
  loadSkeleton(t) {
    const { ID: n } = t;
  }
  initUI() {
    const t = new Pn(this.runtime.storage, "spineAnimation");
    t.createUI(), console.log(t);
  }
}
yt(new Bn(Scratch.runtime));
