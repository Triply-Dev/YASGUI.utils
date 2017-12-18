

var store = require("store");
export interface ItemWrapper<V={}> {
  exp: number,
  val:V,
  namespace:string,
  time: number
}
export default class Storage {
  private namespace:string
  constructor(namespace: string) {
    this.namespace = namespace
  }
  public set<V = {}>(
    key: string,
    val: any,
    expInSeconds: number,
    onQuotaExceeded: (e: any) => void
  ) {
    if (!store.enabled) return; //this is probably in private mode. Don't run, as we might get Js errors
    this.removeExpiredKeys();
    if (key && val !== undefined) {
      //try to store string for dom objects (e.g. XML result). Otherwise, we might get a circular reference error when stringifying this
      if (val.documentElement)
        val = new XMLSerializer().serializeToString(val.documentElement);
      try {
        store.set(key, <ItemWrapper<V>>{
          namespace:this.namespace,
          val: val,
          exp: expInSeconds,
          time: new Date().getTime() /1000
        });
      } catch (e) {
        e.quotaExceeded = isQuotaExceeded(e);
        if (e.quotaExceeded && onQuotaExceeded) {
          onQuotaExceeded(e);
        } else {
          throw e;
        }
      }
    }
  }
  remove(key: string) {
    if (!store.enabled) return; //this is probably in private mode. Don't run, as we might get Js errors
    if (key) store.remove(key);
  }
  removeExpiredKeys() {
    if (!store.enabled) return
    store.each((value: ItemWrapper, key: string) => {
      if (value.exp && (new Date().getTime() / 1000) - value.time > value.exp) {
        this.remove(key);
      }
    });
  }
  removeAll<E>(filter?: (key: string, value: ItemWrapper<E>) => void) {
    if (!store.enabled) return; //this is probably in private mode. Don't run, as we might get Js errors
    if (!filter) {
      store.clearAll();
    } else if (typeof filter === "function") {
      store.each((value: ItemWrapper<E>, key: string) => {
        if (filter(key, value)) this.remove(key);
      });
    }
  }
  removeNamespace() {
    store.each((value: ItemWrapper<any>, key: string) => {
      if (value.namespace && value.namespace === this.namespace) this.remove(key);
    });
  }
  get<V>(key: string):V {
    if (!store.enabled) return null; //this is probably in private mode. Don't run, as we might get Js errors
    this.removeExpiredKeys();
    if (key) {
      var info:ItemWrapper<V> = store.get(key);
      if (!info) {
        return null;
      }
      return info.val;
    } else {
      return null;
    }
  }


}
function isQuotaExceeded(e: any) {
  var quotaExceeded = false;
  if (e) {
    if (e.code) {
      switch (e.code) {
        case 22:
          quotaExceeded = true;
          break;
        case 1014:
          // Firefox
          if (e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
            quotaExceeded = true;
          }
          break;
      }
    } else if (e.number === -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true;
    }
  }
  return quotaExceeded;
}
