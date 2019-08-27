namespace :assets do

  desc "Find Sass::SyntaxError files..."
  task find_scss_with_error: :environment do
    files = Dir.glob( Rails.root.join("app", "assets", "stylesheets", "**/*")).grep(/.*\.[css|scss]/)
    files.each do |file|
        print "Trying to compile #{file}..."
        template = File.read(file)
        sass_engine = Sass::Engine.new(template)
        begin
            sass_engine.render
            print "[OK]"
        rescue
            print "[ERROR]"
        end
        puts
    end
  end

end