import Link from 'next/link'
import { ArrowLeft, Users, Target, Lightbulb } from 'lucide-react'

export default function About() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                About
              </h1>
            </div>
            <div></div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            About This Boilerplate
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            A modern, production-ready Next.js starter template designed to help developers 
            build amazing web applications faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Purpose
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              To provide developers with a solid foundation for building modern web applications 
              without starting from scratch.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Community
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Built by developers, for developers. Open source and community-driven 
              with best practices and modern tools.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Innovation
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Always up-to-date with the latest technologies and development practices 
              to keep your projects cutting-edge.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            What's Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Core Technologies</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Next.js 14 with App Router</li>
                <li>• React 18 with latest features</li>
                <li>• TypeScript for type safety</li>
                <li>• Tailwind CSS for styling</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Development Tools</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li>• ESLint for code quality</li>
                <li>• PostCSS for CSS processing</li>
                <li>• Lucide React for icons</li>
                <li>• Modern font loading</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link
            href="/"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
} 