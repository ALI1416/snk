/**
 * Snk异常
 * @version 2023/07/19 11:11:11
 * @author ALI[ali-k&#64;foxmail.com]
 * @since 1.0.0
 */
class SnkException extends Error {

  /**
   * Snk异常
   * @param message 详细信息
   * @param options 选项
   */
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'SnkException'
  }
}

export {SnkException}
